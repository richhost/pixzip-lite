import { contextBridge, ipcRenderer } from "electron";

const lossApi = {
  "dialog:openFolder": () => ipcRenderer.invoke("dialog:openFolder"),
  "window:close": () => ipcRenderer.send("window:close"),
  "window:minimize": () => ipcRenderer.send("window:minimize"),
  "window:maximize": () => ipcRenderer.send("window:maximize"),
  isMacOS: process.platform === "darwin",
  "config:get": () => ipcRenderer.invoke("config:get"),
  "config:set": (config: IUserConfig) => ipcRenderer.send("config:set", config),
  "file:add": (files: SendFile[]) => ipcRenderer.send("file:add", files),
  "file:clear": () => ipcRenderer.send("clear"),
  "compress:processing": (fn) => ipcRenderer.on("compress:processing", fn),
  "compress:success": (fn) => ipcRenderer.on("compress:success", fn),
  "compress:failed": (fn) => ipcRenderer.on("compress:failed", fn),
  "compress:remove": () => {
    ipcRenderer.removeAllListeners("compress:processing");
    ipcRenderer.removeAllListeners("compress:success");
    ipcRenderer.removeAllListeners("compress:failed");
  },
};

contextBridge.exposeInMainWorld("lossApi", lossApi);
