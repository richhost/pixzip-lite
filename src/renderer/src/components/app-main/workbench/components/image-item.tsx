import { useMemo } from "react";
import { useAtomValue } from "jotai";

import { TooltipProvider } from "~/components/ui/tooltip";
import { tasksAtom } from "~/atoms/tasks";
import { currentWksIDAtom } from "~/atoms/workspaces";
import { basename, bytesToSize, parseImg } from "~/lib/utils";
import { TaskActions } from "./task-actions";

export function ImageItem({ filepath }: { filepath: string }) {
  const workspaceId = useAtomValue(currentWksIDAtom);
  const tasks = useAtomValue(tasksAtom);

  const task = useMemo(() => {
    return tasks
      .get(workspaceId as string)
      ?.find((t) => t.filepath === filepath);
  }, [tasks, workspaceId, filepath]);

  return (
    <TooltipProvider>
      <div className="rounded-lg overflow-hidden border text-sm p-3 flex items-center justify-between gap-8">
        <figure className="flex items-center gap-4 grow">
          <img
            src={parseImg(filepath)}
            alt="img"
            className="w-16 h-16 object-contain"
            loading="lazy"
          />
          <figcaption className="min-w-0 grid gap-1">
            <p className="font-medium truncate">{basename(filepath)}</p>
            <p className="text-muted-foreground">
              {bytesToSize(task?.size ?? 0)}
            </p>
          </figcaption>
        </figure>

        <TaskActions task={task} />
      </div>
    </TooltipProvider>
  );
}
