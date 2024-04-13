import { useState, useSyncExternalStore } from "react";
import { nanoid } from "nanoid";
import { produce } from "immer";
import { useAtom } from "jotai";
import { currentWksIDAtom } from "~/atoms/workspaces";

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
  keepExif: false,
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

function addWorkspace(w: Pixzip.Workspace) {
  workspaces = produce(workspaces, (draft) => {
    draft.push(w);
  });

  window.pixzip.workspace.addWorkspace(w);
  for (const cb of subscribers) {
    cb();
  }

  return w.id;
}

function updateWorkspace(w: Workspace) {
  workspaces = produce(workspaces, (draft) => {
    const index = draft.findIndex((wk) => wk.id === w.id);
    draft[index] = w;
  });

  window.pixzip.workspace.updateWorkspace(w);
  for (const cb of subscribers) {
    cb();
  }
}

function deleteWorkspace(id: string) {
  const length = workspaces.length;
  if (length === 1) return;
  const index = workspaces.findIndex((wk) => wk.id === id);
  workspaces = workspaces.toSpliced(index, 1);

  window.pixzip.workspace.deleteWorkspace(id);
  for (const cb of subscribers) {
    cb();
  }
}

export function useWorkspace() {
  const wks = useSyncExternalStore(subscribe, getSnapshot);
  const [currentWksID, setCurrentWksId] = useAtom(currentWksIDAtom);
  const currentWksIDStorage = window.localStorage.getItem("currentWksID");

  const [preview, setPreview] = useState<Pixzip.Workspace[]>([]);

  if (preview !== wks) {
    setPreview(wks);

    if (!currentWksIDStorage && !currentWksID) {
      setCurrentWksId(wks[0].id);
    }
  }

  const add = () => {
    const w = { ...workspaceTmpl, id: `wks_${nanoid(10)}` };
    addWorkspace(w);
    setCurrentWksId(w.id);
  };

  const del = (id: string) => {
    if (wks.length === 1) return;
    const index = wks.findIndex((wk) => wk.id === id);
    const nextIndex = index >= wks.length - 1 ? index - 1 : index + 1;
    setCurrentWksId(wks[nextIndex].id);
    deleteWorkspace(id);
  };

  return {
    workspaces: wks,
    add,
    patch: updateWorkspace,
    del,
  };
}
