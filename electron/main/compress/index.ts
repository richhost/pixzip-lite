import { getSpaces } from "../space";
import Queue from "./Queue";
import { MAIN_WINDOW_NAME } from "../config";
import WindowManager from "../window";
import { SendData } from "./types";
import { compress, operate } from "./core";

let max = 5;
let taskQueue: Queue<TaskImg> = new Queue<TaskImg>();

function send<K extends keyof SendData>(key: K, val: SendData[K]) {
  const window = WindowManager.getWindow(MAIN_WINDOW_NAME);
  if (!window) return;
  window.webContents.send(key, val);
}

function startProcess() {
  const length = taskQueue.toArray().length;
  const min = Math.min(max, length);

  for (let i = 0; i < min; i++) {
    const img = taskQueue.dequeue();
    max--;

    send("compress-start", {
      path: img.path,
      spaceId: img.spaceId,
      status: "start",
    });

    const buffer = compress(img);
    operate(buffer, img)
      .then(({ outputPath, compressedSize }) => {
        send("compress-success", {
          path: img.path,
          spaceId: img.spaceId,
          status: "success",
          compressedSize,
          outputPath,
        });
      })
      .catch(() =>
        send("compress-failed", {
          path: img.path,
          spaceId: img.spaceId,
          status: "failed",
        })
      )
      .finally(() => {
        max++;
        startProcess();
      });
  }
}

export const addImgs = (imgs: Img[]) => {
  for (const img of imgs) {
    const spaces = getSpaces();
    const space = spaces.find((element) => element.id === img.spaceId);
    if (space) {
      const taskImg: TaskImg = { ...img, config: space };
      taskQueue.enqueue(taskImg);
    } else {
      send("compress-failed", {
        path: img.path,
        status: "failed",
        spaceId: img.spaceId,
      });
    }
  }
  startProcess();
};

export const clearImgs = (spaceId: string) => {
  const copy = taskQueue.toArray();
  const after = copy.filter((element) => element.spaceId !== spaceId);
  taskQueue.clear();
  if (after.length) {
    addImgs(after);
  }
};
