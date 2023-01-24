import { MAIN_WINDOW_NAME } from "../config";
import windowController from "../window-controller";
import Queue from "./utils/Queue";
import { COMPRESS } from "../events";
import { compressCore } from "./utils/core";
import db from "../db";

class Compress {
  // 任务队列
  private taskQueue: Queue<TaskFile>;
  // 最大处理数量
  private max = 5;

  // 添加文件
  addFiles = (_, files: SendFile[]) => {
    for (const file of files) {
      const spaces = db.getSpace();
      const space = spaces.find((element) => element.id === file.spaceId);
      let taskFile: TaskFile = { ...file, config: space };
      this.taskQueue.enqueue(taskFile);
    }
    this.startProcess();
  };

  // 清空文件
  clearFiles = (_, spaceId: string) => {
    // this.taskQueue.clear();
    // TODO
  };

  private startProcess() {
    const length = this.taskQueue.toArray().length;
    const min = Math.min(this.max, length);

    for (let i = 0; i < min; i++) {
      const currentFile = this.taskQueue.dequeue();
      this.max--;

      let sendData = { ...currentFile, status: "processing" };
      delete sendData.config;
      this.send<SendFile>(COMPRESS.PROCESSING, sendData as SendFile);

      compressCore(currentFile)
        .then((data: { compressedSize: number; outputPath: string }) => {
          // 成功
          this.max++;
          this.send<SendFile>(COMPRESS.SUCCESS, {
            ...sendData,
            status: "success",
            compressedSize: data.compressedSize,
            outputPath: data.outputPath,
          });
          this.startProcess();
        })
        .catch(() => {
          // 失败
          this.max++;
          this.startProcess();
          this.send<SendFile>(COMPRESS.FAILED, {
            ...sendData,
            status: "failed",
          });
        });
    }
  }

  // 给渲染进程发送消息
  private send<T extends any>(eventName: string, data: T) {
    const window = windowController.getWindow(MAIN_WINDOW_NAME);
    if (window) {
      window.webContents.send(eventName, data);
    }
  }

  constructor() {
    // 初始化任务队列
    this.taskQueue = new Queue<TaskFile>();
  }
}

export default new Compress();
