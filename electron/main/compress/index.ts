import { BrowserWindow, ipcMain } from "electron";
import configInstance from "../config";
import { avif } from "./avif";
import { compressEmitter } from "./emitter";
import { gif } from "./gif";
import { jpg } from "./jpg";
import { png } from "./png";
import { webp } from "./webp";

export type EmitData = {
  file: SendFile;
  status: ProcessStatus;
  oldSize?: number;
  newSize?: number;
};

class Compress {
  private win: BrowserWindow;

  private files: SendFile[] = [];
  private max = 5;

  private isProcess: boolean = false;

  private handleAddFiles = (evt, files: SendFile[]) => {
    this.files = [...this.files, ...files];

    if (!this.isProcess) {
      this.startProcess();
    }
  };

  // 开始处理
  private startProcess = () => {
    const length = this.files.length;
    const min = Math.min(this.max, length);

    for (let i = 0; i < min; i++) {
      const currentFile = this.files.shift();
      this.max--;
      this.win.webContents.send("onCompress", {
        ...currentFile,
        status: "processing",
      });

      let format = configInstance.config.format;
      if (format === "original") {
        const extension = currentFile.name
          .substring(currentFile.name.lastIndexOf(".") + 1)
          .toLocaleLowerCase();
        format = extension as Format;
      }

      switch (format) {
        case "avif":
          avif(currentFile, configInstance.config);
          break;
        case "jpg":
          jpg(currentFile, configInstance.config);
          break;
        case "png":
          png(currentFile, configInstance.config);
          break;
        case "webp":
          webp(currentFile, configInstance.config);
          break;
        case "gif":
          gif(currentFile, configInstance.config);
          break;
        default:
          break;
      }
    }
  };

  // 清空文件
  private handleFileClear() {
    this.files = [];
    this.isProcess = false;
  }

  private setup() {
    ipcMain.on("file:add", this.handleAddFiles);
    ipcMain.on("file:clear", this.handleFileClear);

    compressEmitter.on("compress", (data: EmitData) => {
      if (data.status === "success" || data.status === "failed") {
        this.max++;
        this.startProcess();

        this.win.webContents.send("onCompress", data);
      }
    });
  }

  constructor(win: BrowserWindow) {
    this.win = win;
    this.setup();
  }
}

export default Compress;
