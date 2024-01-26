import { dialog, ipcMain, shell } from "electron";

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
    // TODO
  });
  ipcMain.on("trash", async (_, filepath: string) => {
    shell.trashItem(filepath);
  });
  ipcMain.on("reveal", async (_, filepath: string) => {
    shell.showItemInFolder(filepath);
  });
};
