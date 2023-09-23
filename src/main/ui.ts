import { app, BrowserWindow } from "electron";

export const uiHandler = {
  handleMinimize: async () => {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach((window) => window.minimize());
  },
  handleMaximize: async () => {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach((window) => {
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    });
  },
  handleClose: async () => {
    app.quit();
  },
};
