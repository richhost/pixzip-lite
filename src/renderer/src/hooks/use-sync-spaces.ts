import { useSyncExternalStore } from "react";
import { spacesStore } from "~/helpers/space-store";

export function useSyncSpaces() {
  return useSyncExternalStore(spacesStore.subscribe, spacesStore.getSnapshot);
}
