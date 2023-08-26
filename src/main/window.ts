import { join } from "node:path";
import { BrowserWindow, app } from "electron";
import windowStateKeeper from "electron-window-state";

async function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600,
  });

  const browserWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
    },
    backgroundMaterial: "mica",
  });

  if (!app.isPackaged && process.env["ELECTRON_RENDERER_URL"]) {
    await browserWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    await browserWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  mainWindowState.manage(browserWindow);
  return browserWindow;
}

let browserWindow: BrowserWindow | undefined = undefined;

export async function restoreOrCreateWindow() {
  browserWindow = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

  if (browserWindow === undefined) {
    browserWindow = await createWindow();
  }

  if (browserWindow.isMinimized()) {
    browserWindow.restore();
  }

  return browserWindow;
}
