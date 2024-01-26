import { produce } from "immer";
import { useAtom, useAtomValue } from "jotai";
import { tasksAtom } from "~/atoms/tasks";
import { currentWksIDAtom } from "~/atoms/workspaces";

export function useTaskAction() {
  const workspaceId = useAtomValue(currentWksIDAtom);
  const [tasks, setTasks] = useAtom(tasksAtom);

  const addTask = (path: string | string[]) => {
    if (!workspaceId) return;
    let tasks: Pixzip.Task | Pixzip.Task[];
    if (Array.isArray(path)) {
      tasks = path.map((p) => ({ workspaceId, filepath: p }));
    } else {
      tasks = { workspaceId, filepath: path };
    }
    setTasks((prev) => {
      const nextState = produce(prev, (draft) => {
        const list = draft.get(workspaceId);
        if (list) {
          const target = list.find((t) => t.filepath === path);
          if (target) target.status = "preprocessing";
        }
      });
      return nextState;
    });
    window.pixzip.task.addTask(tasks);
  };

  const clearTask = () => {
    if (!workspaceId) return;
    window.pixzip.task.clearTask(workspaceId);

    const nextState = produce(tasks, (draft) => {
      draft.delete(workspaceId);
    });
    setTasks(nextState);
  };

  const copyFile = (outputPath: string) => {
    window.pixzip.action.copy(outputPath);
  };

  const remove = (filepath: string) => {
    if (!workspaceId) return;
    setTasks((prev) => {
      const nextState = produce(prev, (draft) => {
        const list = draft.get(workspaceId);
        if (list) {
          const index = list.findIndex((t) => t.filepath === filepath);
          if (index !== -1) list.splice(index, 1);
        }
      });
      return nextState;
    });

    window.pixzip.task.removeTask(workspaceId, filepath);
  };

  const trash = (filepath: string, outputPath: string) => {
    if (!workspaceId) return;
    setTasks((prev) => {
      const nextState = produce(prev, (draft) => {
        const list = draft.get(workspaceId);
        if (list) {
          const index = list.findIndex((t) => t.filepath === filepath);
          if (index !== -1) list.splice(index, 1);
        }
      });
      return nextState;
    });
    window.pixzip.action.trash(outputPath);
  };

  return {
    addTask,
    clearTask,
    copyFile,
    remove,
    trash,
  };
}
