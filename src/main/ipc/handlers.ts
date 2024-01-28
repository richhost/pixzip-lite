import { dialog, ipcMain, shell, clipboard } from "electron";
import { Buffer } from "node:buffer";
import { delimiter } from "../core/constants";

export const registerHandlers = async () => {
  ipcMain.handle("folderPicker", async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    return filePaths;
  });
  ipcMain.on("copy", async (_, filepath: string) => {
    // not support webp, avif....
    // const img = nativeImage.createFromPath(filepath);
    // clipboard.writeImage(img);
  });
  ipcMain.on("trash", async (_, filepath: string) => {
    shell.trashItem(filepath);
  });
  ipcMain.on("reveal", async (_, filepath: string) => {
    shell.showItemInFolder(filepath);
  });
};
