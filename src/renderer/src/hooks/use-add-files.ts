import React, { useCallback, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { produce } from "immer";

import { currentWksIDAtom } from "~/atoms/workspaces";
import { Task, tasksAtom } from "~/atoms/tasks";

export function useAddFiles() {
  const workspace = useAtomValue(currentWksIDAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useAtom(tasksAtom);

  const addFiles = useCallback(
    (t: Task[]) => {
      if (!workspace) return;
      const nextState = produce(tasks, (draft) => {
        const prevTasks = draft.get(workspace) ?? [];
        draft.set(workspace, [...prevTasks, ...t]);
      });
      setTasks(nextState);
    },
    [tasks, workspace, setTasks]
  );

  const normalize = (files: FileList) => {
    if (!workspace) return [];
    const data: Task[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImg = img(files[i]);
      const isExisted = existed(file, tasks.get(workspace) ?? []);
      if (isImg && !isExisted) {
        data.push({
          filepath: file.path,
          size: file.size,
          status: "waiting",
        });
      }
    }
    return data;
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const t = normalize(files);
    addFiles(t);
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
  return imgTypes.includes(file.type);
}

function existed(file: File, tasks: Task[]) {
  return tasks.some((t) => t.filepath === file.path);
}
