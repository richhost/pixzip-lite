import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  dialog,
  ipcMain,
} from "electron";
import { join } from "node:path";
import userConfig from "./config";

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

  // 注册窗口事件
  registerWindowEvent(windowName: string) {
    const window = this.getWindow(windowName);
    if (window && process.platform === "win32") {
      // 暂时约定只有 Windows 系统需要注册
      ipcMain.on("window:close", () => {
        window.close();
      });
      ipcMain.on("window:minimize", () => {
        window.minimize();
      });
      ipcMain.on("window:maximize", () => {
        if (window.isMaximized()) {
          window.unmaximize();
        } else {
          window.maximize();
        }
      });
    }
  }

  // 选择文件夹
  registerOpenFolder() {
    ipcMain.handle("dialog:openFolder", async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });
      if (canceled) return;
      return filePaths[0];
    });
  }

  // 注册用户配置事件
  registerConfig() {
    // 获取配置
    ipcMain.handle("config:get", () => userConfig.config);

    // 修改配置
    ipcMain.on("config:set", (event, config: IUserConfig) => {
      userConfig.config = config;
    });
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
