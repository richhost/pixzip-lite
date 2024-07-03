import { Store } from "@tanstack/react-store";

export type Task =
  | {
      filepath: string;
      size: number;
      status: Exclude<Pixzip.TaskStatus, "succeed">;
    }
  | {
      filepath: string;
      size: number;
      status: Extract<Pixzip.TaskStatus, "succeed">;
      outputPath: string;
      outputSize: number;
    };

type TaskMap = Map<Pixzip.Workspace["id"], Task[]>;

export const tasksStore = new Store<{ taskMap: TaskMap }>({
  taskMap: new Map(),
});

export const addTasks = (spaceId: string, tasks: Task[]) => {
  tasksStore.setState((state) => {
    const list = state.taskMap.get(spaceId) ?? [];
    list.push(...tasks);
    return { taskMap: new Map(state.taskMap).set(spaceId, list) };
  });
  window.pixzip.task.addTask(
    tasks.map((element) => ({
      workspaceId: spaceId,
      filepath: element.filepath,
    }))
  );
};

export const clearTasks = (spaceId: string) => {
  window.pixzip.task.clearTask(spaceId);

  tasksStore.setState((state) => {
    state.taskMap.delete(spaceId);
    return { taskMap: new Map(state.taskMap) };
  });
};
