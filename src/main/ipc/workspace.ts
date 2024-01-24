import { ipcMain } from "electron";

import { store } from "../utils/store";

type Workspace = Pixzip.Workspace;

const defaultWorkspace: Workspace = {
  id: "wks_default",
  name: "Workspace",
  icon: "FaceIcon",
  width: undefined,
  height: undefined,
  suffix: "-min",
  format: "original",
  level: 1,
  autoExec: true,
  originalOutput: true,
  outputDir: "",
};

export const getWorkspaces = () => {
  let wks: Workspace[] = [];

  const fromStore = store.get("workspace");
  if (fromStore) {
    wks = fromStore as Workspace[];
  } else {
    wks = [defaultWorkspace];
  }
  return wks;
};

const addWorkspace = (w: Workspace) => {
  const wks = getWorkspaces();
  wks.push(w);
  store.set("workspace", wks);
  return wks;
};

const updateWorkspace = (w: Workspace) => {
  const wks = getWorkspaces();
  const index = wks.findIndex((wk) => wk.id === w.id);
  wks[index] = w;
  store.set("workspace", wks);
  return wks;
};

const deleteWorkspace = (id: string) => {
  const wks = getWorkspaces();
  const length = wks.length;
  if (length === 1) {
    return wks;
  }
  const index = wks.findIndex((wk) => wk.id === id);

  wks.splice(index, 1);
  store.set("workspace", wks);
  return wks;
};

export const registerWorkspaceHandlers = () => {
  ipcMain.handle("getWorkspaces", () => getWorkspaces());
  ipcMain.handle("addWorkspace", (_, w: Workspace) => addWorkspace(w));
  ipcMain.handle("updateWorkspace", (_, w: Workspace) => updateWorkspace(w));
  ipcMain.handle("deleteWorkspace", (_, id: string) => deleteWorkspace(id));
};
