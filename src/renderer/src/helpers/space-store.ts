import { updateDefaultSpace } from "~/stores/space";
import { getDefaultSpace } from "./space";

type Space = Pixzip.Workspace;
let spaces: Space[] = [];

spaces = await window.pixzip.workspace.getWorkspaces();
const defaultSpaces = getDefaultSpace();
if (!defaultSpaces) {
  updateDefaultSpace(spaces[0].id);
}

const subscribers = new Set<() => void>();

export const spacesStore = {
  subscribe(listener: () => void) {
    subscribers.add(listener);
    return () => {
      subscribers.delete(listener);
    };
  },
  getSnapshot() {
    return spaces;
  },
  addSpace(space: Space) {
    spaces = [space, ...spaces];
    window.pixzip.workspace.addWorkspace(space);
    for (const cb of subscribers) {
      cb();
    }
  },
  updateSpace(space: Space) {
    const index = spaces.findIndex((wk) => wk.id === space.id);
    spaces = spaces.toSpliced(index, 1, space);
    window.pixzip.workspace.updateWorkspace(space);
    for (const cb of subscribers) {
      cb();
    }
  },
  deleteSpace(id: string) {
    const index = spaces.findIndex((wk) => wk.id === id);
    spaces = spaces.toSpliced(index, 1);
    window.pixzip.workspace.deleteWorkspace(id);
    for (const cb of subscribers) {
      cb();
    }
  },
};
