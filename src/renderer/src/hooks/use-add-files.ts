import type React from "react";
import { useRef } from "react";
import { useStore } from "@tanstack/react-store";

import { filePromise, readEntriesPromise } from "~/lib/utils";
import { defaultSpaceStore } from "~/stores/space";
import { addTasks, tasksStore, type Task } from "~/stores/task";

export function useAddFiles() {
  const spaceId = useStore(defaultSpaceStore);

  const inputRef = useRef<HTMLInputElement>(null);
  const tasks = useStore(tasksStore, (state) => state.get(spaceId || "") ?? []);

  const normalize = (files: FileList | File[]) => {
    if (!spaceId) return [];
    const data: Task[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImg = img(files[i]);
      const isExisted = existed(file, tasks);
      if (isImg && !isExisted) {
        data.push({
          filepath: file.path,
          size: file.size,
          status: "preprocessing",
        });
      }
    }
    return data;
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const items = [...event.dataTransfer.items];

    const scanFiles = async (
      item: FileSystemEntry,
      fileList: Promise<File>[]
    ) => {
      if (item.isFile) {
        fileList.push(filePromise(item as FileSystemFileEntry));
      } else if (item.isDirectory) {
        const directoryReader = (
          item as FileSystemDirectoryEntry
        ).createReader();
        const res = await readEntriesPromise(directoryReader);
        for (const entry of res) {
          await scanFiles(entry, fileList);
        }
      }
    };

    const fileList: Promise<File>[] = [];

    // FileSystemEntry List
    const entries = items.reduce((acc, item) => {
      if (item.webkitGetAsEntry() !== null) {
        acc.push(item.webkitGetAsEntry() as FileSystemEntry);
      }
      return acc;
    }, [] as FileSystemEntry[]);

    const eachFiles = async () => {
      for (let i = 0; i < entries.length; i++) {
        const item = entries[i];
        if (item) {
          await scanFiles(item, fileList);
        }
      }

      Promise.all(fileList).then((files) => {
        const t = normalize(files);
        spaceId && addTasks(spaceId, t);
      });
    };
    eachFiles();
  };

  const handleInputFile = () => {
    if (!inputRef.current) return;
    const files = inputRef.current?.files;
    if (files?.length) {
      const t = normalize(files);
      spaceId && addTasks(spaceId, t);
    }
    inputRef.current.value = "";
  };

  return {
    handleDrop,
    handleInputFile,
    inputRef,
  };
}

function img(file: File) {
  const imgTypes = "image/avif,image/gif,image/jpeg,image/png,image/webp";
  return file.type && imgTypes.includes(file.type);
}

function existed(file: File, tasks: Task[]) {
  return tasks.some((t) => t.filepath === file.path);
}
