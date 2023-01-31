import { contextBridge, ipcRenderer } from "electron";

const compressBridge = {
  start: (
    callback: (path: string, spaceId: string, status: ImgStatus) => void
  ) => {
    ipcRenderer.on("compress-start", (_, path, spaceId, status) => {
      callback(path, spaceId, status);
    });
  },
  success: (
    callback: (
      path: string,
      spaceId: string,
      status: ImgStatus,
      compressedSize: number
    ) => void
  ) => {
    ipcRenderer.on(
      "compress-success",
      (_, path, spaceId, status, compressedSize) => {
        callback(path, spaceId, status, compressedSize);
      }
    );
  },
  failed: (
    callback: (path: string, spaceId: string, status: ImgStatus) => void
  ) => {
    ipcRenderer.on("compress-failed", (_, path, spaceId, status) => {
      callback(path, spaceId, status);
    });
  },
  removeListeners: () => {
    ipcRenderer.removeAllListeners("compress-start");
    ipcRenderer.removeAllListeners("compress-success");
    ipcRenderer.removeAllListeners("compress-failed");
  },
};

const spaceBridge = {
  getSpaces: (): Promise<Space[]> => {
    return ipcRenderer.invoke("get-spaces");
  },
  addSpace: (): Promise<Space> => {
    return ipcRenderer.invoke("add-space");
  },
  patchSpace: (data: Space) => {
    ipcRenderer.send("patch-space", data);
  },
  delSpace: (id: string): Promise<false | { def: string }> => {
    return ipcRenderer.invoke("del-space", id);
  },
  getDefault: (): Promise<string> => {
    return ipcRenderer.invoke("get-default");
  },
  setDefault: (id: string): Promise<boolean> => {
    return ipcRenderer.invoke("set-default", id);
  },
};

const imgBridge = {
  addImgs: (data: Img[]) => {
    ipcRenderer.send("add-imgs", data);
  },
  clearImgs: (spaceId: string) => {
    ipcRenderer.send("clear-imgs", spaceId);
  },
  showInFolder: (outputPath: string) => {
    ipcRenderer.send("show-in-folder", outputPath);
  },
};

const utilBridge = {
  isMacOS: process.platform === "darwin",
  folderPicker: (): Promise<string[]> => {
    return ipcRenderer.invoke("folder-picker");
  },
};

contextBridge.exposeInMainWorld("space", spaceBridge);
contextBridge.exposeInMainWorld("img", imgBridge);
contextBridge.exposeInMainWorld("compress", compressBridge);
contextBridge.exposeInMainWorld("util", utilBridge);
