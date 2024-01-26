import { ipcMain } from "electron";
import { addTask, clearTask, removeTask } from "../core";
import type { AddTask, Task } from "../core";

export function registerTaskHandlers() {
  ipcMain.on("addTask", (_, task: AddTask) => addTask(task));
  ipcMain.on("clearTask", (_, workspaceId: string) => clearTask(workspaceId));
  ipcMain.on("removeTask", (_, task: Task) => removeTask(task));
}
