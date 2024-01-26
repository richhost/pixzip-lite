import { dialog, ipcMain, clipboard, nativeImage } from "electron";

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
};
