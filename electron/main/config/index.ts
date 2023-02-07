import { join } from "node:path";
import { BrowserWindowConstructorOptions } from "electron";

export const MAIN_WINDOW_NAME = "main";

const preload = join(__dirname, "../../preload/index.js");

const base: BrowserWindowConstructorOptions = {
  title: "像素丢失",
  width: 880,
  height: 580,
  minWidth: 880,
  minHeight: 580,
  titleBarStyle: "hidden",
  webPreferences: {
    preload,
  },
};

const macOptions: BrowserWindowConstructorOptions = {
  ...base,
  trafficLightPosition: {
    x: 20,
    y: 20,
  },
};

const winOptions: BrowserWindowConstructorOptions = {
  ...base,
  titleBarOverlay: {
    color: "hsl(0, 0%, 99.0%)",
  },
};

const linxOptions: BrowserWindowConstructorOptions = {
  ...base,
  frame: false,
};

let windowOptions: BrowserWindowConstructorOptions = winOptions;

if (process.platform === "darwin") windowOptions = macOptions;
if (process.platform === "win32") windowOptions = winOptions;
if (process.platform === "linux") {
  let iconPath = join(process.cwd(), "/resources/extraResources/icon.png");
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) iconPath = join(process.cwd(), "/resources/icons/linux/icon.png");

  linxOptions.icon = iconPath;
  windowOptions = linxOptions;
}

export default windowOptions;
