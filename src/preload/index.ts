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
  removeTask: (workspaceId: string, filepath: string) =>
    ipcRenderer.send("removeTask", { workspaceId, filepath }),
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
  trash: (outputPath: string) => ipcRenderer.send("trash", outputPath),
  reveal: (outputPath: string) => ipcRenderer.send("reveal", outputPath),
  folderPicker,
  openUrl: (url: string) => ipcRenderer.send("openUrl", url),
};

const pixzip = {
  os: process.platform,
  ui,
  workspace,
  task,
  action,
};

contextBridge.exposeInMainWorld("pixzip", pixzip);

declare global {
  interface Window {
    pixzip: typeof pixzip;
  }
}
