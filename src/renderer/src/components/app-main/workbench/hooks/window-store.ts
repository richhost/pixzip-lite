type WindowStore = {
  maximized: boolean;
  listeners: (() => void)[];
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => boolean;
};

const windowStore: WindowStore = {
  maximized: false,
  listeners: [],
  subscribe: (listener: () => void) => {
    windowStore.listeners.push(listener);

    return () => {
      windowStore.listeners = windowStore.listeners.filter(
        (l) => l !== listener
      );
    };
  },
  getSnapshot: () => windowStore.maximized,
};

function listeners() {
  for (const l of windowStore.listeners) {
    l();
  }
}

window.pixzip.ui.onMaximized(() => {
  windowStore.maximized = true;
  listeners();
});

window.pixzip.ui.onUnmaximized(() => {
  windowStore.maximized = false;
  listeners();
});

export { windowStore };
