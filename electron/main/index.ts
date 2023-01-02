import { join } from "node:path";
import { app, BrowserWindow, Menu } from "electron";
import windowController from "./window-controller";
import Compress from "./compress";

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
process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());
const preload = join(__dirname, "../preload/index.js");

function createWindow() {
  const WINDOW_NAME = "main";

  windowController.createWindow(WINDOW_NAME, {
    title: "像素丢失",
    width: 880,
    height: 580,
    minWidth: 880,
    minHeight: 580,
    titleBarStyle: "hidden",
    trafficLightPosition: {
      x: 20,
      y: 20,
    },
    webPreferences: {
      preload,
    },
  });

  windowController.loadWebContainer(WINDOW_NAME);
  windowController.registerWindowEvent(WINDOW_NAME);
  windowController.registerOpenFolder();
  windowController.registerConfig();

  const window = windowController.getWindow(WINDOW_NAME);
  if (window) new Compress(window);
}

app.whenReady().then(createWindow);

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

const menu = Menu.buildFromTemplate([
  {
    label: "像素丢失",
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
  applicationName: "像素丢失",
  applicationVersion: "1.0.0",
  version: "",
});
