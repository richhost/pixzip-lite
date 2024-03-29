import { useAtomValue } from "jotai";
import { Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

import { scrollAtom } from "../atom";
import { useWorkspaceConfig } from "../hooks/use-workspace-config";

export function Toolbar() {
  const position = useAtomValue(scrollAtom);
  const { delWorkspace } = useWorkspaceConfig();

  return (
    <header
      className={cn(
        "h-[var(--h-header)] draggable px-1.5 flex items-center shrink-0",
        {
          shadow: position?.top,
        }
      )}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="no-drag cursor-default"
              size="icon"
              onClick={delWorkspace}
            >
              <Trash2 size={16} className="no-drag" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>删除</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </header>
  );
}
