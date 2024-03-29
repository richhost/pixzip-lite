import type React from "react";
import { useCallback, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { produce } from "immer";

import { currentWksIDAtom } from "~/atoms/workspaces";
import { type Task, tasksAtom } from "~/atoms/tasks";
import { useWorkspace } from "./use-workspace";
import { filePromise, readEntriesPromise } from "~/lib/utils";

export function useAddFiles() {
  const workspaceId = useAtomValue(currentWksIDAtom);
  const { workspaces } = useWorkspace();

  const currentWorkspace = workspaces.find((w) => w.id === workspaceId);

  const inputRef = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useAtom(tasksAtom);

  const addFiles = useCallback(
    (t: Task[]) => {
      if (!currentWorkspace) return;
      setTasks((prev) => {
        const nextState = produce(prev, (draft) => {
          const prevTasks = draft.get(currentWorkspace.id) ?? [];
          draft.set(currentWorkspace.id, [...prevTasks, ...t]);
        });
        return nextState;
      });
      if (currentWorkspace.autoExec) {
        window.pixzip.task.addTask(
          t.map((t) => ({
            workspaceId: currentWorkspace.id,
            filepath: t.filepath,
          }))
        );
      }
    },
    [currentWorkspace, setTasks]
  );

  const normalize = (files: FileList | File[]) => {
    if (!currentWorkspace) return [];
    const data: Task[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImg = img(files[i]);
      const isExisted = existed(file, tasks.get(currentWorkspace.id) ?? []);
      if (isImg && !isExisted) {
        data.push({
          filepath: file.path,
          size: file.size,
          status: currentWorkspace.autoExec ? "preprocessing" : "waiting",
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
        addFiles(t);
      });
    };
    eachFiles();
  };

  const handleInputFile = () => {
    if (!inputRef.current) return;
    const files = inputRef.current?.files;
    if (files?.length) {
      const t = normalize(files);
      addFiles(t);
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
