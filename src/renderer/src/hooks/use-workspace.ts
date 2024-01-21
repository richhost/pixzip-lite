import { useSyncExternalStore } from "react";
import { nanoid } from "nanoid";

type Workspace = Pixzip.Workspace;

let workspaces: Workspace[] = [];
const subscribers = new Set<() => void>();

const workspaceTmpl: Omit<Workspace, "id"> = {
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

await window.pixzip.workspace.getWorkspaces().then((w) => {
  workspaces = w;
});

function subscribe(l: () => void) {
  subscribers.add(l);
  return () => {
    subscribers.delete(l);
  };
}

function getSnapshot() {
  return workspaces;
}

function addWorkspace() {
  const w = { ...workspaceTmpl, id: `wks_${nanoid(10)}` };
  workspaces = [...workspaces, w];

  window.pixzip.workspace.addWorkspace(w);
  for (const cb of subscribers) {
    cb();
  }
}

function updateWorkspace(w: Workspace) {
  const index = workspaces.findIndex((wk) => wk.id === w.id);
  workspaces[index] = w;
  window.pixzip.workspace.updateWorkspace(w);
  for (const cb of subscribers) {
    cb();
  }
}

function deleteWorkspace(id: string) {
  const length = workspaces.length;
  if (length === 1) {
    return;
  }
  const index = workspaces.findIndex((wk) => wk.id === id);

  workspaces = workspaces.toSpliced(index, 1);
  window.pixzip.workspace.deleteWorkspace(id);
  for (const cb of subscribers) {
    cb();
  }
}

export function useWorkspace() {
  const wks = useSyncExternalStore(subscribe, getSnapshot);

  return {
    workspaces: wks,
    add: addWorkspace,
    patch: updateWorkspace,
    del: deleteWorkspace,
  };
}
