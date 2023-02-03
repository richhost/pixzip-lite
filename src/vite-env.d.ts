/// <reference types="vite/client" />

type Platform =
  | "aix"
  | "android"
  | "darwin"
  | "freebsd"
  | "haiku"
  | "linux"
  | "openbsd"
  | "sunos"
  | "win32"
  | "cygwin"
  | "netbsd";

interface SpaceBridge {
  getSpaces: () => Promise<Space[]>;
  addSpace: () => Promise<Space>;
  patchSpace: (data: Space) => void;
  delSpace: (id: string) => Promise<false | { def: string }>;
  getDefault: () => Promise<string>;
  setDefault: (id: string) => Promise<boolean>;
}

interface ImgBridge {
  addImgs: (data: Img[]) => void;
  clearImgs: (spaceId: string) => void;
  showInFolder: (outputPath: string) => void;
}

interface CompressBridge {
  start: (
    callback: (params: {
      path: string;
      spaceId: string;
      status: ImgStatus;
    }) => void
  ) => void;
  success: (
    callback: (params: {
      path: string;
      spaceId: string;
      status: ImgStatus;
      compressedSize: number;
      outputPath: string;
    }) => void
  ) => void;
  failed: (
    callback: (params: {
      path: string;
      spaceId: string;
      status: ImgStatus;
    }) => void
  ) => void;
  removeListeners: () => void;
}

interface UtilBridge {
  platform: Platform;
  folderPicker: () => Promise<string[]>;
}

interface LinuxBridge {
  onMaximize: (callback: () => void) => void;
  onUnmaximize: (callback: () => void) => void;
  minimize: () => void;
  maximize: () => void;
  unmaximize: () => void;
  close: () => void;
  removeListeners: () => void;
}

interface Window {
  space: SpaceBridge;
  img: ImgBridge;
  compress: CompressBridge;
  util: UtilBridge;
  linux?: LinuxBridge;
}

interface FileWithPath extends File {
  path: string;
}
