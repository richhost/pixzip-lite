import { useSyncExternalStore } from "react";
import { windowStore } from "./window-store";

export function useWindowCtr() {
  const min = () => window.pixzip.ui.minimize();
  const max = () => window.pixzip.ui.maximize();
  const close = () => window.pixzip.ui.close();
  const restore = () => window.pixzip.ui.unmaximize();

  const maximized = useSyncExternalStore(windowStore.subscribe, () =>
    windowStore.getSnapshot()
  );

  return {
    min,
    max,
    close,
    restore,
    maximized,
  };
}
