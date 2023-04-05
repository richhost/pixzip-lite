import { ipcMain, dialog, shell } from "electron";
import { addImgs, clearImgs } from "./compress";
import { MAIN_WINDOW_NAME } from "./config";
import {
  addSpace,
  delSpace,
  getDefault,
  getSpaces,
  patchSpace,
  setDefault,
} from "./space";
import WindowManager from "./window";

export const registerIpc = () => {
  ipcMain.handle("folder-picker", async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    return filePaths;
  });

  ipcMain.handle("get-spaces", async () => {
    return getSpaces();
  });
  ipcMain.handle("add-space", async (_, id: string) => {
    return addSpace(id);
  });
  ipcMain.on("patch-space", (_, data: Space) => {
    patchSpace(data);
  });
  ipcMain.handle("del-space", async (_, id: string) => {
    return delSpace(id);
  });
  ipcMain.handle("get-default", async () => {
    return getDefault();
  });
  ipcMain.handle("set-default", async (_, id: string) => {
    return setDefault(id);
  });

  ipcMain.on("add-imgs", (_, data: Img[]) => {
    addImgs(data);
  });
  ipcMain.on("clear-imgs", (_, spaceId: string) => {
    clearImgs(spaceId);
  });
  ipcMain.on("show-in-folder", (_, path: string) => {
    shell.showItemInFolder(path);
  });
};

export const registerWindowIpc = () => {
  const win = WindowManager.getWindow(MAIN_WINDOW_NAME);
  ipcMain.on("maximize", () => {
    win.maximize();
  });
  ipcMain.on("unmaximize", () => {
    win.unmaximize();
  });
  ipcMain.on("minimize", () => {
    win.minimize();
  });
  ipcMain.on("close", () => {
    win.close();
  });
};
