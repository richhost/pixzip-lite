import { ipcMain, dialog, shell } from "electron";
import { addImgs, clearImgs } from "./compress";
import {
  addSpace,
  delSpace,
  getDefault,
  getSpaces,
  patchSpace,
  setDefault,
} from "./space";

const registerIpc = () => {
  ipcMain.handle("folder-picker", async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    return filePaths;
  });

  ipcMain.handle("get-spaces", async () => {
    return getSpaces();
  });
  ipcMain.handle("add-space", async () => {
    return addSpace();
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

export default registerIpc;
