import Conf from "conf";
import { app } from "electron";

const instance = new Conf({
  configName: "config",
  fileExtension: "json",
  projectName: app.getName(),
  projectSuffix: "",
});

export const store = {
  get(key: string) {
    return instance.get(key);
  },
  set(key: string, value: unknown) {
    instance.set(key, value);
  },
};
