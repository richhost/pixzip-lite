import { dialog, ipcMain } from "electron";
import windowController from "./window-controller";
import compress from "./compress";
import db from "./db";

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

  // Space
  registerSpace() {
    // get
    ipcMain.handle("space:get", () => db.getSpace());

    // add
    ipcMain.handle("space:add", (event, data: Omit<Space, "id">) => {
      db.add(data);
    });

    // del
    ipcMain.on("space:del", (event, id: string) => {
      db.del(id);
    });

    // path
    ipcMain.on("space:patch", (event, data: Space[]) => {
      db.patch(data);
    });

    // set current id
    ipcMain.on("space:setCurrentId", (event, id: string) => {
      db.setCurrentSpaceId(id);
    });

    // get current id
    ipcMain.handle("space:getCurrentId", (event) => db.getCurrentSpaceId());
  }

  // 注册添加文件事件
  registerAddFiles() {
    // ipcMain.on("file:add", compress.addFiles);
  }

  // 清空文件
  registerClearFiles() {
    ipcMain.on("file:clear", compress.clearFiles);
  }

  constructor() {}
}

export default new IPCManager();
