import { app } from "electron";
import { restoreOrCreateWindow } from "./window";
import { registerUIHandlers } from "./ipc";
import { registerWorkspaceHandlers } from "./ipc/workspace";

app.on("window-all-closed", () => {
  if (process.platform === "darwin") app.quit();
});

app
  .whenReady()
  .then(restoreOrCreateWindow)
  .then((browserWindow) => {
    registerUIHandlers(browserWindow);
    registerWorkspaceHandlers();
  })
  .catch((e) => console.error("create window failed: ", e));
