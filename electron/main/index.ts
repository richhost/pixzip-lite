import { app, BrowserWindow, Menu } from "electron";
import windowController from "./window-controller";
import { MAIN_WINDOW_NAME, winOptions, macOptions } from "./config";
import registerIpc from "./ipc";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

function createWindow() {
  const options = process.platform === "darwin" ? macOptions : winOptions;
  windowController.createWindow(MAIN_WINDOW_NAME, options);
  windowController.loadWebContainer(MAIN_WINDOW_NAME);
}

app.whenReady().then(() => {
  createWindow();
  registerIpc();
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  windowController.clearAllWindows();
  if (process.platform !== "darwin") app.quit();
});

// 防止重复启动
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

const menu = Menu.buildFromTemplate([
  {
    label: app.getName(),
    submenu: [
      {
        label: "关于",
        role: "about",
      },
    ],
  },
]);
Menu.setApplicationMenu(menu);
app.setAboutPanelOptions({
  applicationName: app.getName(),
  applicationVersion: app.getVersion(),
  version: "",
});
