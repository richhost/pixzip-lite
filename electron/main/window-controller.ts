import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { join } from "node:path";

const url = process.env.VITE_DEV_SERVER_URL;

class WindowController {
  private winInstances: {
    [key: string]: BrowserWindow;
  };

  // 创建窗口
  createWindow(windowName: string, options: BrowserWindowConstructorOptions) {
    let window = new BrowserWindow(options);
    window.loadURL(url);
    this.winInstances[windowName] = window;

    window.on(
      "closed",
      ((windowName) => {
        return () => {
          delete this.winInstances[windowName];
        };
      })(windowName)
    );
  }

  // 获取窗口
  getWindow(windowName: string) {
    return this.winInstances[windowName];
  }

  // 加载 Web 资源
  loadWebContainer(windowName: string) {
    const isDev = process.env.VITE_DEV_SERVER_URL;
    const url = process.env.VITE_DEV_SERVER_URL;
    const indexHtml = join(process.env.DIST, "index.html");

    if (isDev) {
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

export default new WindowController();
