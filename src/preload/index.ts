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

const folderPicker = () =>
  ipcRenderer.invoke("folderPicker") as Promise<string[]>;

type ProcessingParams = Extract<Pixzip.SendData, { status: "processing" }>;
type SucceedParams = Extract<Pixzip.SendData, { status: "succeed" }>;
type FailedParams = Extract<Pixzip.SendData, { status: "failed" }>;

const task = {
  addTask: (task: Pixzip.Task | Pixzip.Task[]) =>
    ipcRenderer.send("addTask", task),
  clearTask: (workspaceId: string) =>
    ipcRenderer.send("clearTask", workspaceId),
  precessing: (cb: (params: ProcessingParams) => void) =>
    ipcRenderer.on("processing", (_, params) => {
      cb(params);
    }),
  succeed: (cb: (params: SucceedParams) => void) => {
    ipcRenderer.on("succeed", (_, params) => {
      cb(params);
    });
  },
  failed: (cb: (params: FailedParams) => void) => {
    ipcRenderer.on("failed", (_, params) => {
      cb(params);
    });
  },
  removePrecessingListener: () => ipcRenderer.removeAllListeners("processing"),
  removeSucceedListener: () => ipcRenderer.removeAllListeners("succeed"),
  removeFailedListener: () => ipcRenderer.removeAllListeners("failed"),
};

const action = {
  copy: (filepath: string) => ipcRenderer.send("copy", filepath),
};

const pixzip = {
  os: process.platform,
  ui,
  workspace,
  folderPicker,
  task,
  action,
};

contextBridge.exposeInMainWorld("pixzip", pixzip);

declare global {
  interface Window {
    pixzip: typeof pixzip;
  }
}
