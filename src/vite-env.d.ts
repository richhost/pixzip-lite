/// <reference types="vite/client" />

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
  isMacOS: boolean;
  folderPicker: () => Promise<string[]>;
}

interface Window {
  space: SpaceBridge;
  img: ImgBridge;
  compress: CompressBridge;
  util: UtilBridge;
}

interface FileWithPath extends File {
  path: string;
}
