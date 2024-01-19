import { contextBridge, ipcRenderer } from "electron";

const ui = {
  minimize: () => ipcRenderer.send("minimize"),
  maximize: () => ipcRenderer.send("maximize"),
  unmaximize: () => ipcRenderer.send("unmaximize"),
  close: () => ipcRenderer.send("close"),
  onMaximized: (callback) => ipcRenderer.on("maximized", callback),
  onUnmaximized: (callback) => ipcRenderer.on("unmaximized", callback),

  removeListeners: () => {
    ipcRenderer.removeAllListeners("maximized");
    ipcRenderer.removeAllListeners("unmaximized");
  },
};

const workspace = {
  getWorkspaces: () =>
    ipcRenderer.invoke("getWorkspaces") as Promise<Pixzip.Workspace[]>,
  addWorkspace: (w: Pixzip.Workspace) =>
    ipcRenderer.invoke("addWorkspace", w) as Promise<Pixzip.Workspace[]>,
  updateWorkspace: (w: Pixzip.Workspace) =>
    ipcRenderer.invoke("updateWorkspace", w) as Promise<Pixzip.Workspace[]>,
  deleteWorkspace: (id: string) =>
    ipcRenderer.invoke("deleteWorkspace", id) as Promise<Pixzip.Workspace[]>,
};

const pixzip = {
  os: process.platform,
  ui,
  workspace,
};

contextBridge.exposeInMainWorld("pixzip", pixzip);

declare global {
  interface Window {
    pixzip: typeof pixzip;
  }
}
