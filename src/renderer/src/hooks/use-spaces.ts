import { nanoid } from "nanoid";
import { useSyncSpaces } from "./use-sync-spaces";
import { spacesStore } from "~/helpers/space-store";
import { updateDefaultSpace } from "~/stores/space";

type Space = Pixzip.Workspace;

const spaceTmpl: Omit<Space, "id"> = {
  name: "Space",
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

export function useSpace() {
  const spaces = useSyncSpaces();

  const addSpace = () => {
    const space = { ...spaceTmpl, id: `space_${nanoid(10)}` };
    spacesStore.addSpace(space);
    updateDefaultSpace(space.id);
  };

  const delSpace = (id: string) => {
    if (spaces.length === 1) return;

    const index = spaces.findIndex((s) => s.id === id);
    const nextIndex = index >= spaces.length - 1 ? index - 1 : index + 1;
    const targetId = spaces[nextIndex].id;
    updateDefaultSpace(targetId);
    spacesStore.deleteSpace(id);
  };

  const updateSpace = (space: Space) => {
    spacesStore.updateSpace(space);
  };

  return { spaces, addSpace, delSpace, updateSpace };
}
