import { app, BrowserWindow, Menu } from "electron";
import WindowManager from "./window";
import windowOptions, { MAIN_WINDOW_NAME } from "./config";
import { registerIpc, registerWindowIpc } from "./ipc";

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
  const options = windowOptions;
  WindowManager.createWindow(MAIN_WINDOW_NAME, options);
  WindowManager.loadWebContainer(MAIN_WINDOW_NAME);
}

app.whenReady().then(() => {
  createWindow();
  registerIpc();
  if (process.platform === "linux") registerWindowIpc();
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
  WindowManager.clearAllWindows();
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
