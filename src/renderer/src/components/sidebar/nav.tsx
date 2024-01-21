import { Plus } from "lucide-react";

import { ScrollArea } from "~/components/ui/scroll-area";
import { WorkspaceIcon } from "~/components/ui/workspace-icon";
import { useWorkspace } from "~/hooks/use-workspace";
import { Button } from "../ui/button";

export function Nav() {
  const { workspaces, add } = useWorkspace();

  return (
    <>
      <ScrollArea className="h-full">
        <nav className="space-y-2 p-1 text-sm">
          {workspaces.map(({ id, ...rest }) => (
            <NavItem key={id} {...rest} />
          ))}
        </nav>
      </ScrollArea>
      <div className="p-1 border-t">
        <Button variant="ghost" size="sm" className="w-full" onClick={add}>
          <Plus />
        </Button>
      </div>
    </>
  );
}

function NavItem(props: Omit<Pixzip.Workspace, "id">) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between gap-3 px-1 py-2 rounded cursor-default hover:bg-secondary font-semibold"
    >
      <div className="flex min-w-0 items-center gap-2">
        <WorkspaceIcon className="shrink-0" name={props.icon} />
        <span className="min-w-0 truncate">{props.name}</span>
      </div>
      {/* <div className="shrink-0">4</div> */}
    </button>
  );
}
