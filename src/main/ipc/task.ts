import { ipcMain } from "electron";
import { addTask, clearTask, removeTask } from "../core";
import type { AddTask, Task } from "../core";

export function registerTaskHandlers() {
  ipcMain.handle("addTask", (_, task: AddTask) => addTask(task));
  ipcMain.handle("clearTask", (_, workspaceId: string) =>
    clearTask(workspaceId)
  );
  ipcMain.handle("removeTask", (_, task: Task) => removeTask(task));
}
