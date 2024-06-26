// https://github.com/kenan2002/electron-clipboard-ex

import { platform, arch } from "node:os";

const platformPath = `${platform()}-${arch()}`;

export const loadClipboardEx = async () => {
  return new Promise((resolve) => {
    if (platform() !== "linux") {
      import(`./${platformPath}/node.napi.node`).then((module) => {
        resolve(module.default);
      });
    }
  }) as Promise<ClipboardEx>;
};

type ClipboardEx = {
  writeFilePaths: (filePaths: string[]) => string[];
};
