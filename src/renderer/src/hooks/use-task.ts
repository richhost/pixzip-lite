import { Task, tasksStore } from "~/stores/task";

window.pixzip.task.precessing((task) => {
  tasksStore.setState((state) => {
    const list = state.get(task.workspaceId);
    if (list) {
      const t = list.find((t) => t.filepath === task.filepath);
      if (t) task.status = "processing";
    }
    return structuredClone(state);
  });
});

window.pixzip.task.succeed((task) => {
  tasksStore.setState((state) => {
    const list = state.get(task.workspaceId);
    if (list) {
      const t = list.find((t) => t.filepath === task.filepath) as Extract<
        Task,
        { status: "succeed" }
      >;
      if (t) {
        t.status = "succeed";
        t.outputSize = task.fileSize;
        t.outputPath = task.outputPath;
      }
    }
    return structuredClone(state);
  });
});

window.pixzip.task.failed((task) => {
  tasksStore.setState((state) => {
    const list = state.get(task.workspaceId);
    if (list) {
      const t = list.find((t) => t.filepath === task.filepath);
      if (t) t.status = "failed";
    }
    return structuredClone(state);
  });
});
