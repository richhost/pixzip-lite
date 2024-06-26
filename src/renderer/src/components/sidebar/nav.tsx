import { useStore } from "@tanstack/react-store";
import { PlusIcon } from "@radix-ui/react-icons";

import { WorkspaceIcon } from "~/components/ui/workspace-icon";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "~/lib/utils.ts";
import { OS } from "~/lib/os.ts";
import { useSpace } from "~/hooks/use-spaces";
import { defaultSpaceStore, updateDefaultSpace } from "~/stores/space";

export function Nav() {
  const { spaces, addSpace } = useSpace();

  return (
    <>
      <div className="h-full overflow-auto">
        <nav
          className={cn("grid grid-cols-1 gap-1 p-2 text-sm", {
            "pt-0": OS === "darwin",
          })}
        >
          {spaces.map((w) => (
            <NavItem key={w.id} {...w} />
          ))}
        </nav>
      </div>
      <div className="m-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-dashed bg-transparent shadow-none"
          onClick={addSpace}
        >
          <PlusIcon />
        </Button>
      </div>
    </>
  );
}

function NavItem(props: Pixzip.Workspace) {
  const defaultId = useStore(defaultSpaceStore);

  return (
    <button
      type="button"
      className={cn(
        buttonVariants({
          variant: props.id === defaultId ? "default" : "ghost",
          size: "sm",
        })
      )}
      onClick={() => {
        if (defaultId !== props.id) updateDefaultSpace(props.id);
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
