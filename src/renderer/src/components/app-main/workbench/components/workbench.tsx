import { useMemo, useState } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";

import { HeadBar } from "./head-bar";
import { ImageItem } from "./image-item";
import { Empty } from "./empty";
import { useAtomValue } from "jotai";
import { currentWksIDAtom } from "~/atoms/workspaces";
import { tasksAtom } from "~/atoms/tasks";
import { useAddFiles } from "~/hooks/use-add-files";
import { cn } from "~/lib/utils";
import { Scroll } from "../../workspace/atom";

export function Workbench() {
  const currentWorkspaceId = useAtomValue(currentWksIDAtom);
  const tasks = useAtomValue(tasksAtom);

  const list = useMemo(() => {
    if (currentWorkspaceId) {
      return tasks.get(currentWorkspaceId) || [];
    }
    return [];
  }, [tasks, currentWorkspaceId]);

  const { handleDrop } = useAddFiles();

  const [position, setPosition] = useState<Scroll>();

  return (
    <section className="flex flex-col h-full">
      <HeadBar position={position} />
      <ScrollArea
        className={cn("h-full", { "border-t": position?.top })}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onScroll={(event) => {
          const target = event.target as HTMLDivElement;
          setPosition({
            top: target.scrollTop,
            left: target.scrollLeft,
          });
        }}
      >
        <div className="space-y-2 p-4">
          {list.length === 0 ? (
            <Empty />
          ) : (
            list.map((item) => (
              <ImageItem key={item.filepath} filepath={item.filepath} />
            ))
          )}
        </div>
      </ScrollArea>
    </section>
  );
}
