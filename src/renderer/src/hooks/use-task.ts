import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { produce } from "immer";

import { tasksAtom } from "~/atoms/tasks";
import type { Task } from "~/atoms/tasks";

export function useTask() {
  const setTasks = useSetAtom(tasksAtom);

  useEffect(() => {
    window.pixzip.task.precessing((task) => {
      setTasks((prev) => {
        const nextState = produce(prev, (draft) => {
          const list = draft.get(task.workspaceId);
          if (list) {
            const t = list.find((t) => t.filepath === task.filepath);
            if (t) task.status = "processing";
          }
        });
        return nextState;
      });
    });

    window.pixzip.task.succeed((task) => {
      setTasks((prev) => {
        const nextState = produce(prev, (draft) => {
          const list = draft.get(task.workspaceId);
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
        });

        return nextState;
      });
    });

    window.pixzip.task.failed((task) => {
      setTasks((prev) => {
        const nextState = produce(prev, (draft) => {
          const list = draft.get(task.workspaceId);
          if (list) {
            const t = list.find((t) => t.filepath === task.filepath);
            if (t) t.status = "failed";
          }
        });
        return nextState;
      });
    });

    return () => {
      window.pixzip.task.removePrecessingListener();
      window.pixzip.task.removeSucceedListener();
      window.pixzip.task.removeFailedListener();
    };
  }, [setTasks]);
}
