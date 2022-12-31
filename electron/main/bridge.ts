import { ipcMain, dialog, BrowserWindow } from "electron";
import configInstance from "./config";
import Compress from "./compress";

class Bridge {
  static instance: Bridge;

  private win: BrowserWindow;

  // 窗口管理
  private windowManage() {
    ipcMain.on("window:close", () => {
      this.win.close();
    });
    ipcMain.on("window:minimize", () => {
      this.win.minimize();
    });
    ipcMain.on("window:maximize", () => {
      if (this.win.isMaximized()) {
        this.win.unmaximize();
      } else {
        this.win.maximize();
      }
    });
  }

  async handleFolderOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    if (canceled) return;
    return filePaths[0];
  }
  private handleConfigSet(evt, config: UserConfig) {
    configInstance.config = config;
  }
  private async handleConfigGet() {
    return configInstance.config;
  }

  // 配置管理
  private configManage() {
    // 选择文件夹
    ipcMain.handle("dialog:openFolder", this.handleFolderOpen);
    // 获取配置文件
    ipcMain.handle("config:get", this.handleConfigGet);
    // 修改配置
    ipcMain.on("config:set", this.handleConfigSet);
  }

  private setup() {
    this.windowManage();
    this.configManage();
  }

  constructor(win: BrowserWindow) {
    if (Bridge.instance) return;
    Bridge.instance = this;

    this.win = win;
    this.setup();
    new Compress(win);
  }
}

export default Bridge;
