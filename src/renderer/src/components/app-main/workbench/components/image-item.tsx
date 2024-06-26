import { useStore } from "@tanstack/react-store";

import { TooltipProvider } from "~/components/ui/tooltip";
import { basename, bytesToSize, parseImg } from "~/lib/utils";
import { TaskActions } from "./task-actions";
import { defaultSpaceStore } from "~/stores/space";
import { tasksStore } from "~/stores/task";

export function ImageItem({ filepath }: { filepath: string }) {
  const spaceId = useStore(defaultSpaceStore);
  const tasks = useStore(tasksStore, (state) => state.get(spaceId || "") ?? []);

  const task = tasks.find((t) => t.filepath === filepath);

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
