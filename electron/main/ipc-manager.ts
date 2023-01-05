import { dialog, ipcMain } from "electron";
import windowController from "./window-controller";
import userConfig from "./config/user-config";
import compress from "./compress";

class IPCManager {
  // Windows 窗口管理：关闭、最小化、最大化
  windowsWindowController(windowName: string) {
    const window = windowController.getWindow(windowName);
    if (process.platform === "win32" && window) {
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

  // 注册添加文件事件
  registerAddFiles() {
    ipcMain.on("file:add", compress.addFiles);
  }

  // 清空文件
  registerClearFiles() {
    ipcMain.on("file:clear", compress.clearFiles);
  }

  constructor() {}
}

export default new IPCManager();
