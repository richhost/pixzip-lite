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

  const copyFile = (filepath: string) => {
    window.pixzip.action.copy(filepath);
  };

  return {
    addTask,
    clearTask,
    copyFile,
  };
}
