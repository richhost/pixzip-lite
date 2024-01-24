import { atom } from "jotai";

export type Task =
  | {
      filepath: string;
      size: number;
      status: Exclude<Pixzip.TaskStatus, "succeed">;
    }
  | {
      filepath: string;
      size: number;
      status: Extract<Pixzip.TaskStatus, "succeed">;
      outputPath: string;
      outputSize: number;
    };

type TaskMap = Map<Pixzip.Workspace["id"], Task[]>;

export const tasksAtom = atom<TaskMap>(new Map());
