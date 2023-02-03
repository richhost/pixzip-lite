import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { join } from "node:path";

process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

class WindowManager {
  private winInstances: {
    [key: string]: BrowserWindow;
  };

  // 创建窗口
  createWindow(windowName: string, options: BrowserWindowConstructorOptions) {
    let window = new BrowserWindow(options);
    this.winInstances[windowName] = window;

    window.on(
      "closed",
      ((windowName) => {
        return () => {
          delete this.winInstances[windowName];
        };
      })(windowName)
    );

    if (process.platform === "linux") {
      window.on(
        "maximize",
        ((windowName) => {
          return () => {
            this.winInstances[windowName].webContents.send("on-maximize");
          };
        })(windowName)
      );
      window.on(
        "unmaximize",
        ((windowName) => {
          return () => {
            this.winInstances[windowName].webContents.send("on-unmaximize");
          };
        })(windowName)
      );
    }
  }

  // 获取窗口
  getWindow(windowName: string) {
    return this.winInstances[windowName];
  }

  // 加载 Web 资源
  loadWebContainer(windowName: string) {
    if (url) {
      this.winInstances[windowName].loadURL(url);
      this.winInstances[windowName].webContents.openDevTools();
    } else {
      this.winInstances[windowName].loadFile(indexHtml);
    }
  }

  // 清空所有窗口
  clearAllWindows() {
    this.winInstances = {};
  }

  constructor() {
    this.winInstances = {};
  }
}

export default new WindowManager();
