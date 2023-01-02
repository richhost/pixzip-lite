/// <reference types="vite/client" />

type LossAPI = {
  "dialog:openFolder": Function;
  "window:close": Function;
  "window:minimize": Function;
  "window:maximize": Function;
  isMacOS: boolean;
  "config:get": () => Promise<IUserConfig>;
  "config:set": (config: IUserConfig) => void;
  "file:add": (files: SendFile[]) => void;
  "file:clear": () => void;
  onCompress: Function;
};

interface Window {
  lossApi: LossAPI;
}
