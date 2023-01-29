/// <reference types="vite/client" />

type LossAPI = {
  "dialog:openFolder": Function;
  "window:close": Function;
  "window:minimize": Function;
  "window:maximize": Function;
  isMacOS: boolean;
  "space:get": () => Promise<Space[]>;
  "space:add": (data?: Omit<Space, "id">) => Promise<Space>;
  "space:patch": (data: Space[]) => void;
  "space:del": (
    id: string
  ) => Promise<{ currentSpaceId: string; spaces: Space[] }>;
  "space:getCurrentId": () => Promise<string>;
  "space:setCurrentId": (id: string) => void;
  "file:add": (files: SendFile[]) => void;
  "file:clear": (spaceId: string) => void;
  "file:showInFolder": (path: string) => void;
  onCompress: Function;
  "compress:processing": Function;
  "compress:success": Function;
  "compress:failed": Function;
  "compress:remove": () => void;
};

interface Window {
  lossApi: LossAPI;
}
