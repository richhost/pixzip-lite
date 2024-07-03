import { useStore } from "@tanstack/react-store";
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
import { defaultSpaceStore } from "~/stores/space";
import { clearTasks, tasksStore } from "~/stores/task";

export function HeadBar() {
  const { handleInputFile, inputRef } = useAddFiles();

  const spaceId = useStore(defaultSpaceStore);
  const tasks = useStore(
    tasksStore,
    (state) => state.taskMap.get(spaceId || "") ?? []
  );

  return (
    <header
      className={cn(
        "flex items-center h-[var(--h-header)] draggable justify-between shrink-0"
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
                  if (!spaceId) return;
                  tasksStore.setState((state) => {
                    const list = structuredClone(
                      state.taskMap.get(spaceId) ?? []
                    );
                    const status = ["preprocessing", "processing"];
                    for (const item of list) {
                      if (!status.includes(item.status)) {
                        item.status = "preprocessing";
                      }
                    }

                    return {
                      taskMap: new Map(state.taskMap).set(spaceId, list),
                    };
                  });
                  window.pixzip.task.addTask(
                    tasks.map((element) => ({
                      workspaceId: spaceId,
                      filepath: element.filepath,
                    }))
                  );
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
                onClick={() => {
                  spaceId && clearTasks(spaceId);
                }}
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
