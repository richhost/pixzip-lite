import { useAtom } from "jotai";
import { PlusIcon } from "@radix-ui/react-icons";

import { ScrollArea } from "~/components/ui/scroll-area";
import { WorkspaceIcon } from "~/components/ui/workspace-icon";
import { useWorkspace } from "~/hooks/use-workspace";
import { Button, buttonVariants } from "../ui/button";
import { currentWksIDAtom } from "~/atoms/workspaces";
import { cn } from "~/lib/utils.ts";
import { OS } from "~/lib/os.ts";

export function Nav() {
  const { workspaces, add } = useWorkspace();

  return (
    <>
      <ScrollArea className="h-full">
        <nav
          className={cn("grid grid-cols-1 gap-1 p-2 text-sm", {
            "pt-0": OS === "darwin",
          })}
        >
          {workspaces.map((w) => (
            <NavItem key={w.id} {...w} />
          ))}
        </nav>
      </ScrollArea>
      <div className="m-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-dashed bg-transparent shadow-none"
          onClick={add}
        >
          <PlusIcon />
        </Button>
      </div>
    </>
  );
}

function NavItem(props: Pixzip.Workspace) {
  const [currentWksID, setCurrentWksID] = useAtom(currentWksIDAtom);

  return (
    <button
      type="button"
      className={cn(
        buttonVariants({
          variant: props.id === currentWksID ? "default" : "ghost",
          size: "sm",
        })
      )}
      onClick={() => {
        if (currentWksID !== props.id) setCurrentWksID(props.id);
      }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <WorkspaceIcon className="shrink-0" name={props.icon} />
        <span className="min-w-0 truncate">{props.name}</span>
      </div>
      <div className="shrink-0 ml-auto" />
    </button>
  );
}
