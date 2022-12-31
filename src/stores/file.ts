import { atom } from "recoil";

export const filesStore = atom<SendFile[]>({
  key: "filesStore",
  default: [],
});

export const fileStatusStore = atom<
  Map<
    SendFile["path"],
    {
      status: ProcessStatus;
      size?: number;
    }
  >
>({
  key: "fileStatusStore",
  default: new Map(),
});
