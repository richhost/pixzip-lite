import userConfig from "../config";
import windowController from "../window-controller";
import { avif } from "./avif";
import { compressEmitter } from "./emitter";
import { gif } from "./gif";
import { jpg } from "./jpg";
import { png } from "./png";
import { webp } from "./webp";

const WINDOW_NAME = "main";

export type EmitData = {
  file: SendFile;
  status: ProcessStatus;
  oldSize?: number;
  newSize?: number;
};

class Compress {
  // 文件列表
  private files: SendFile[] = [];
  // 最大处理数量
  private max = 5;
  // 是否正在处理
  private isProcess: boolean = false;

  addFiles = (event, files: SendFile[]) => {
    this.files.push(...files);

    if (!this.isProcess) this.startProcess();
  };

  clearFiles = (event) => {
    this.files = [];
    this.isProcess = false;
  };

  private startProcess() {
    const length = this.files.length;
    const min = Math.min(this.max, length);

    for (let i = 0; i < min; i++) {
      const currentFile = this.files.shift();
      this.max--;

      this.send("onCompress", {
        ...currentFile,
        status: "processing",
      });

      let format = userConfig.config.format;
      if (format === "original") {
        const extension = currentFile.name
          .substring(currentFile.name.lastIndexOf(".") + 1)
          .toLocaleLowerCase();
        format = extension as Format;
      }

      switch (format) {
        case "avif":
          avif(currentFile, userConfig.config);
          break;
        case "jpg":
          jpg(currentFile, userConfig.config);
          break;
        case "png":
          png(currentFile, userConfig.config);
          break;
        case "webp":
          webp(currentFile, userConfig.config);
          break;
        case "gif":
          gif(currentFile, userConfig.config);
          break;
        default:
          jpg(currentFile, userConfig.config);
          break;
      }
    }
  }

  private send(eventName: string, data: any) {
    const window = windowController.getWindow(WINDOW_NAME);
    if (window) {
      window.webContents.send(eventName, data);
    }
  }

  constructor() {
    compressEmitter.on("compress", (data: EmitData) => {
      if (data.status === "success" || data.status === "failed") {
        this.max++;
        this.startProcess();

        this.send("onCompress", data);
      }
    });
  }
}

export default new Compress();
