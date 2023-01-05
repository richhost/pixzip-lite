import { MAIN_WINDOW_NAME } from "../config";
import windowController from "../window-controller";
import Queue from "./utils/Queue";
import { COMPRESS } from "../events";
import { compressCore } from "./utils/core";

class Compress {
  // 任务队列
  private taskQueue: Queue<SendFile>;
  // 最大处理数量
  private max = 5;

  // 添加文件
  addFiles = (_, files: SendFile[]) => {
    this.taskQueue.enqueue(files);
    this.startProcess();
  };

  // 清空文件
  clearFiles = (_) => {
    this.taskQueue.clear();
  };

  private startProcess() {
    const length = this.taskQueue.toArray().length;
    const min = Math.min(this.max, length);

    for (let i = 0; i < min; i++) {
      const currentFile = this.taskQueue.dequeue();
      this.max--;

      this.send(COMPRESS.PROCESSING, {
        ...currentFile,
      });

      compressCore(currentFile)
        .then((data: { newSize: number }) => {
          // 成功
          this.max++;
          this.startProcess();
          this.send(COMPRESS.SUCCESS, { ...currentFile, ...data });
        })
        .catch(() => {
          // 失败
          this.max++;
          this.startProcess();
          this.send(COMPRESS.FAILED, currentFile);
        });
    }
  }

  // 给渲染进程发送消息
  private send(eventName: string, data: any) {
    const window = windowController.getWindow(MAIN_WINDOW_NAME);
    if (window) {
      window.webContents.send(eventName, data);
    }
  }

  constructor() {
    // 初始化任务队列
    this.taskQueue = new Queue<SendFile>();
  }
}

export default new Compress();
