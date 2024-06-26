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
      const list = state.get(spaceId);
      if (list) {
        const target = list.find((t) => t.filepath === path);
        if (target) target.status = "preprocessing";
      }
      return structuredClone(state);
    });
    window.pixzip.task.addTask(tasks);
  };

  const copyFile = (outputPath: string) => {
    window.pixzip.action.copy(outputPath);
  };

  const remove = (filepath: string) => {
    if (!spaceId) return;
    tasksStore.setState((state) => {
      const list = state.get(spaceId);
      if (list) {
        const index = list.findIndex((t) => t.filepath === filepath);
        if (index !== -1) list.splice(index, 1);
      }
      return structuredClone(state);
    });

    window.pixzip.task.removeTask(spaceId, filepath);
  };

  const trash = (filepath: string, outputPath: string) => {
    if (!spaceId) return;
    tasksStore.setState((state) => {
      const list = state.get(spaceId);
      if (list) {
        const index = list.findIndex((t) => t.filepath === filepath);
        if (index !== -1) list.splice(index, 1);
      }
      return structuredClone(state);
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
