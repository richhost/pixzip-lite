import { app, Menu } from "electron";
import {
  registerHandlers,
  registerWorkspaceHandlers,
  registerUIHandlers,
  registerTaskHandlers,
} from "./ipc";
import { restoreOrCreateWindow } from "./window";
import { registerProtocol } from "./protocol";

app.on("window-all-closed", () => {
  app.quit();
});

app
  .whenReady()
  .then(registerProtocol)
  .then(restoreOrCreateWindow)
  .then((browserWindow) => {
    registerUIHandlers(browserWindow);
    registerWorkspaceHandlers();
    registerTaskHandlers();
    registerHandlers();
  })
  .catch((e) => console.error("create window failed: ", e));

const menus = Menu.buildFromTemplate([
  {
    label: app.getName(),
    submenu: [
      {
        label: "About",
        role: "about",
      },
    ],
  },
]);
Menu.setApplicationMenu(menus);
app.setAboutPanelOptions({
  applicationName: app.getName(),
  applicationVersion: app.getVersion(),
  version: "",
});
