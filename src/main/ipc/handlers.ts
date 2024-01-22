import { dialog, ipcMain } from "electron";

export const registerHandlers = async () => {
  ipcMain.handle('folderPicker', async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    return filePaths;
  })
};
