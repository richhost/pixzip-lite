import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("apis", {
  ipcRenderer: {
    send(channel: string, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
  },
});
