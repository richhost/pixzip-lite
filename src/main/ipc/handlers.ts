import { dialog, ipcMain, shell } from "electron";
import clipboardEx from "electron-clipboard-ex";

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
    clipboardEx.writeFilePaths([filepath]);
  });
  ipcMain.on("trash", async (_, filepath: string) => {
    shell.trashItem(filepath);
  });
  ipcMain.on("reveal", async (_, filepath: string) => {
    shell.showItemInFolder(filepath);
  });
  ipcMain.on("openUrl", async (_, url: string) => {
    shell.openExternal(url);
  });
};
