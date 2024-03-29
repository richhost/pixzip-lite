import { fileURLToPath } from "node:url";
import { BrowserWindow, app } from "electron";
import windowStateKeeper from "electron-window-state";

const platform = process.platform;

async function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 500,
  });

  const browserWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 800,
    minHeight: 400,
    frame: !(platform === "linux"),
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 10, y: 14 },
    vibrancy: "sidebar",
    visualEffectState: "active",
    transparent: platform === "darwin",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: fileURLToPath(new URL("../preload/index.mjs", import.meta.url)),
    },
  });

  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    browserWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
    browserWindow.webContents.openDevTools();
  } else {
    browserWindow.loadFile(
      fileURLToPath(new URL("../renderer/index.html", import.meta.url))
    );
  }

  mainWindowState.manage(browserWindow);
  return browserWindow;
}

let browserWindow: BrowserWindow | undefined;

export async function restoreOrCreateWindow() {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) app.quit();
  browserWindow = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

  if (browserWindow === undefined) {
    browserWindow = await createWindow();
  }

  if (browserWindow.isMinimizable()) {
    browserWindow.restore();
  }

  return browserWindow;
}

export async function getMainWindow() {
  if (browserWindow === undefined) {
    return await restoreOrCreateWindow();
  }
  return browserWindow;
}
