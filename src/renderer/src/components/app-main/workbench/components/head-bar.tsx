import { produce } from "immer";
import { Eraser, Plus, PlayIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { OS } from "~/lib/os";
import { cn } from "~/lib/utils";

import { WindowCtr } from "./window-ctr";
import { useAddFiles } from "~/hooks/use-add-files";
import { useTaskAction } from "~/hooks/use-task-action";
import { useAtom, useAtomValue } from "jotai";
import { tasksAtom } from "~/atoms/tasks";
import { currentWksIDAtom } from "~/atoms/workspaces";
import { useMemo } from "react";
import { Scroll } from "../../workspace/atom";

export function HeadBar({ position }: { position: Scroll }) {
  const { handleInputFile, inputRef } = useAddFiles();
  const { clearTask, addTask } = useTaskAction();

  const [tasks, setTasks] = useAtom(tasksAtom);
  const workspaceId = useAtomValue(currentWksIDAtom);

  const list = useMemo(() => {
    if (!workspaceId) return [];
    return tasks.get(workspaceId) ?? [];
  }, [tasks, workspaceId]);

  return (
    <header
      className={cn(
        "flex items-center h-[var(--h-header)] draggable justify-between shrink-0",
        {
          shadow: position?.top,
        }
      )}
    >
      <TooltipProvider>
        <div className="px-1.5 space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="no-drag cursor-default relative"
                size="icon"
              >
                <label htmlFor="update-file" className="absolute inset-0" />
                <input
                  id="update-file"
                  type="file"
                  className="hidden"
                  ref={inputRef}
                  accept="image/avif, image/jpeg, image/png, image/webp, image/gif"
                  multiple
                  hidden
                  onChange={handleInputFile}
                />
                <Plus size={16} className="no-drag" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>添加图片</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="no-drag cursor-default"
                size="icon"
                onClick={() => {
                  if (!workspaceId) return;
                  setTasks((prev) => {
                    const nextState = produce(prev, (draft) => {
                      const list = draft.get(workspaceId);
                      if (list) {
                        for (const item of list) {
                          if (
                            item.status !== "preprocessing" &&
                            item.status !== "processing"
                          ) {
                            item.status = "preprocessing";
                          }
                        }
                      }
                    });

                    return nextState;
                  });
                  addTask(list.map((i) => i.filepath));
                }}
              >
                <PlayIcon size={16} className="no-drag" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>开始压缩</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="no-drag cursor-default"
                size="icon"
                onClick={() => clearTask()}
              >
                <Eraser size={16} className="no-drag" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>清空列表</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      {OS !== "darwin" && <WindowCtr />}
    </header>
  );
}
