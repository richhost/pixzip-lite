import { useSyncExternalStore } from "react";

let appMaximized = false;

function subscribeWindowMaximized(callback: () => void) {
  window.pixzip.ui.onMaximized(() => {
    appMaximized = true;
    callback();
  });
  window.pixzip.ui.onUnmaximized(() => {
    appMaximized = false;
    callback();
  });

  return () => {
    window.pixzip.ui.removeListeners();
  };
}

export function useUI() {
  const minApp = () => window.pixzip.ui.minimize();
  const maxApp = () => window.pixzip.ui.maximize();
  const closeApp = () => window.pixzip.ui.close();
  const restoreApp = () => window.pixzip.ui.unmaximize();

  const windowMaximized = useSyncExternalStore(
    subscribeWindowMaximized,
    () => appMaximized
  );

  return {
    minApp,
    maxApp,
    closeApp,
    restoreApp,
    windowMaximized,
  };
}
