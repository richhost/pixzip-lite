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

export const macOptions: BrowserWindowConstructorOptions = {
  ...base,
  trafficLightPosition: {
    x: 20,
    y: 20,
  },
};

export const winOptions: BrowserWindowConstructorOptions = {
  ...base,
  titleBarOverlay: {
    color: "hsl(0, 0%, 99.0%)",
  },
};
