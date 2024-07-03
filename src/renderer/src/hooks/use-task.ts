import { Task, tasksStore } from "~/stores/task";

window.pixzip.task.precessing((task) => {
  tasksStore.setState((state) => {
    const list = structuredClone(state.taskMap.get(task.workspaceId) ?? []);

    const t = list.find((t) => t.filepath === task.filepath);
    if (t) task.status = "processing";

    return { taskMap: new Map(state.taskMap).set(task.workspaceId, list) };
  });
});

window.pixzip.task.succeed((task) => {
  tasksStore.setState((state) => {
    const list = structuredClone(state.taskMap.get(task.workspaceId) ?? []);
    const t = list.find((t) => t.filepath === task.filepath) as Extract<
      Task,
      { status: "succeed" }
    >;
    if (t) {
      t.status = "succeed";
      t.outputSize = task.fileSize;
      t.outputPath = task.outputPath;
    }

    return { taskMap: new Map(state.taskMap).set(task.workspaceId, list) };
  });
});

window.pixzip.task.failed((task) => {
  tasksStore.setState((state) => {
    const list = structuredClone(state.taskMap.get(task.workspaceId) ?? []);
    const t = list.find((t) => t.filepath === task.filepath);
    if (t) t.status = "failed";
    return { taskMap: new Map(state.taskMap).set(task.workspaceId, list) };
  });
});
