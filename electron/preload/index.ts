import { contextBridge, ipcRenderer } from "electron";

const lossApi = {
  "dialog:openFolder": () => ipcRenderer.invoke("dialog:openFolder"),
  "window:close": () => ipcRenderer.send("window:close"),
  "window:minimize": () => ipcRenderer.send("window:minimize"),
  "window:maximize": () => ipcRenderer.send("window:maximize"),
  isMacOS: process.platform === "darwin",
  "config:get": () => ipcRenderer.invoke("config:get"),
  "config:set": (config: UserConfig) => ipcRenderer.send("config:set", config),
  "file:add": (files: SendFile[]) => ipcRenderer.send("file:add", files),
  "file:clear": () => ipcRenderer.send("clear"),
  onCompress: (
    cb: (
      evt,
      data: SendFile & {
        status: "success" | "failed" | "waiting" | "process";
        oldSize?: number;
        newSize?: number;
      }
    ) => void
  ) => ipcRenderer.on("onCompress", cb),
};

contextBridge.exposeInMainWorld("lossApi", lossApi);
