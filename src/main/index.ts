import { app } from "electron";
import { restoreOrCreateWindow } from "./window";

app.enableSandbox();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app
  .whenReady()
  .then(restoreOrCreateWindow)
  .catch((e) => console.error("create window failed", e));
