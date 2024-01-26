import { getMainWindow } from "../window";
import { Queue } from "./queue";
import { fileExists, getConfig, output, zip } from "./utils";

export type Task = { workspaceId: string; filepath: string };
export type AddTask = Task | Task[];

let max = 5;
const taskQueue = new Queue<Task>();

async function send(data: Pixzip.SendData) {
  const window = await getMainWindow();
  window.webContents.send(data.status, data);
}

function bootTask() {
  const length = taskQueue.toArray().length;
  const min = Math.min(max, length);
  for (let i = 0; i < min; i++) {
    const task = taskQueue.dequeue();
    if (task) {
      max--;
      const config = getConfig(task.workspaceId);
      if (!fileExists(task.filepath) || !config) {
        send({
          status: "failed",
          filepath: task.filepath,
          workspaceId: task.workspaceId,
        });
        max++;
        bootTask();
      } else {
        zip(task.filepath, config)
          .then((buffer) => {
            return output(buffer, task.filepath, config);
          })
          .then(({ size, filepath: outputPath }) => {
            send({
              status: "succeed",
              workspaceId: task.workspaceId,
              filepath: task.filepath,
              fileSize: size,
              outputPath,
            });
            max++;
            bootTask();
          })
          .catch(() => {
            send({
              status: "failed",
              filepath: task.filepath,
              workspaceId: task.workspaceId,
            });
            max++;
            bootTask();
          });
      }
    }
  }
}

export function addTask(tasks: AddTask) {
  if (Array.isArray(tasks)) {
    for (const t of tasks) {
      taskQueue.enqueue(t);
    }
  } else {
    taskQueue.enqueue(tasks);
  }
  bootTask();
}

export function clearTask(workspaceId: string) {
  const copy = taskQueue.toArray();
  const filter = copy.filter((element) => element.workspaceId !== workspaceId);
  taskQueue.clear();
  if (filter.length) addTask(filter);
}

export function removeTask(task: Task) {
  const copy = taskQueue.toArray();
  const filter = copy.filter(
    (element) =>
      element.workspaceId !== task.workspaceId &&
      element.filepath !== task.filepath
  );
  taskQueue.clear();
  if (filter.length) addTask(filter);
}
