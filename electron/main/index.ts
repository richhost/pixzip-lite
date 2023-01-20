import { app, BrowserWindow, Menu } from "electron";
import windowController from "./window-controller";
import ipcManager from "./ipc-manager";
import { MAIN_WINDOW_NAME, winOptions, macOptions } from "./config";

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
  // 针对 Windows 系统注册窗口最小化、最大化、关闭事件
  ipcManager.windowsWindowController(MAIN_WINDOW_NAME);
}

app.whenReady().then(() => {
  createWindow();
  // 选择保存文件夹
  ipcManager.registerOpenFolder();
  // Space
  ipcManager.registerSpace();
  // 添加文件
  ipcManager.registerAddFiles();
  // 清空文件
  ipcManager.registerClearFiles();
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
