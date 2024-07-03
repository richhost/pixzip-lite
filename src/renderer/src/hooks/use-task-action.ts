import { useStore } from "@tanstack/react-store";
import { defaultSpaceStore } from "~/stores/space";
import { tasksStore } from "~/stores/task";

export function useTaskAction() {
  const spaceId = useStore(defaultSpaceStore);

  const addTask = (path: string | string[]) => {
    if (!spaceId) return;
    let tasks: Pixzip.Task | Pixzip.Task[];
    if (Array.isArray(path)) {
      tasks = path.map((p) => ({ workspaceId: spaceId, filepath: p }));
    } else {
      tasks = { workspaceId: spaceId, filepath: path };
    }
    tasksStore.setState((state) => {
      const list = structuredClone(state.taskMap.get(spaceId) ?? []);
      const target = list.find((t) => t.filepath === path);
      if (target) target.status = "preprocessing";

      return { taskMap: new Map(state.taskMap).set(spaceId, list) };
    });
    window.pixzip.task.addTask(tasks);
  };

  const copyFile = (outputPath: string) => {
    window.pixzip.action.copy(outputPath);
  };

  const remove = (filepath: string) => {
    if (!spaceId) return;
    tasksStore.setState((state) => {
      const list = state.taskMap.get(spaceId);
      if (list) {
        const index = list.findIndex((t) => t.filepath === filepath);
        if (index !== -1) {
          state.taskMap.set(spaceId, list.toSpliced(index, 1));
        }
      }
      return { taskMap: new Map(state.taskMap) };
    });

    window.pixzip.task.removeTask(spaceId, filepath);
  };

  const trash = (filepath: string, outputPath: string) => {
    if (!spaceId) return;
    tasksStore.setState((state) => {
      const list = state.taskMap.get(spaceId);
      if (list) {
        const index = list.findIndex((t) => t.filepath === filepath);
        if (index !== -1) {
          state.taskMap.set(spaceId, list.toSpliced(index, 1));
        }
      }
      return { taskMap: new Map(state.taskMap) };
    });
    window.pixzip.action.trash(outputPath);
  };

  return {
    addTask,
    copyFile,
    remove,
    trash,
  };
}
