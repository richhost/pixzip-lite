import { ipcMain } from "electron";
import type { BrowserWindow } from "electron";

/**
 * register ipcMain event listeners for ui actions
 */
export const registerUIHandlers = (browserWindow: BrowserWindow) => {
  ipcMain.on("maximize", () => browserWindow.maximize());
  ipcMain.on("unmaximize", () => browserWindow.unmaximize());
  ipcMain.on("minimize", () => browserWindow.minimize());
  ipcMain.on("close", () => browserWindow.close());

  browserWindow.on("maximize", () => {
    return browserWindow.webContents.send("maximized");
  });
  browserWindow.on("unmaximize", () =>
    browserWindow.webContents.send("unmaximized"),
  );
};
