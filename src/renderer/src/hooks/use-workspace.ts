import { useMemo, useState, useSyncExternalStore } from "react";

type Workspace = Pixzip.Workspace;

let workspaces: Workspace[] = [];
const subscribers = new Set<() => void>();

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

function addWorkspace(w: Workspace) {
  workspaces.push(w);
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

  workspaces.splice(index, 1);
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
    update: updateWorkspace,
    delete: deleteWorkspace,
  };
}
