import { dialog, ipcMain, shell } from "electron";
import compress from "./compress";
import db from "./db";

class IPCManager {
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
    ipcMain.handle("space:add", (event, data?: Omit<Space, "id">) => {
      return db.add(data);
    });

    // del
    ipcMain.on("space:del", (event, id: string) => {
      compress.clearFiles("", id);
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
    ipcMain.on("file:add", compress.addFiles);
  }

  // 清空文件
  registerClearFiles() {
    ipcMain.on("file:clear", compress.clearFiles);
  }

  // show in folder
  showInFolder() {
    ipcMain.on("file:showInFolder", (event, path: string) => {
      shell.showItemInFolder(path);
    });
  }

  constructor() {}
}

export default new IPCManager();
