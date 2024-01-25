import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { match } from "ts-pattern";
import {
  ArrowDownIcon,
  CopyIcon,
  ExternalLinkIcon,
  PlayIcon,
  TrashIcon,
  DotsHorizontalIcon,
  MinusIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";

import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";

import { tasksAtom } from "~/atoms/tasks";
import { currentWksIDAtom } from "~/atoms/workspaces";
import { basename, bytesToSize, parseImg } from "~/lib/utils";

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
          <figcaption className="min-w-0">
            <p className="font-medium truncate">{basename(filepath)}</p>
            <p className="text-muted-foreground">
              {bytesToSize(task?.size ?? 0)}
            </p>
          </figcaption>
        </figure>

        <div className="shrink-0">
          {match(task?.status)
            .with("waiting", () => <Failed />)
            .with("preprocessing", () => <Preprocessing />)
            .with("processing", () => <div>processing</div>)
            .with("succeed", () => <div>completed</div>)
            .with("failed", () => <div>failed</div>)
            .otherwise(() => null)}
        </div>
      </div>
    </TooltipProvider>
  );
}

function Waiting() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" className="w-6 h-6 px-0">
          <PlayIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>开始压缩</TooltipContent>
    </Tooltip>
  );
}

function Preprocessing() {
  return (
    <div className="w-10">
      <div className="dot-rolling" />
    </div>
  );
}

function Succeed() {
  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        <Badge>JPG</Badge>
        <Badge variant="outline" className="space-x-2">
          <span className="text-muted-foreground">1 MB</span>
          <ArrowDownIcon />
          <span>22%</span>
        </Badge>
      </div>

      <Separator className="my-2" />

      <div className="flex items-center h-5 space-x-2">
        <Button variant="ghost" className="w-6 h-6 px-0">
          <CopyIcon className="pointer-events-none" />
        </Button>
        <Separator orientation="vertical" />
        <Button variant="ghost" className="w-6 h-6 px-0">
          <ExternalLinkIcon className="pointer-events-none" />
        </Button>
        <Separator orientation="vertical" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-6 h-6 px-0">
              <DotsHorizontalIcon className="pointer-events-none" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <MinusIcon className="mr-2" />
              <span>移除</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TrashIcon className="mr-2" />
              <span>删除</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function Failed() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Badge variant="destructive">无法压缩</Badge>
        <span className="text-muted-foreground font-normal text-xs">
          请调整配置后重试
        </span>
      </div>

      <Separator className="my-2" />

      <div className="flex items-center h-5 space-x-2">
        <Button variant="ghost" className="w-6 h-6 px-0">
          <ReloadIcon className="pointer-events-none" />
        </Button>
        <Separator orientation="vertical" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-6 h-6 px-0">
              <DotsHorizontalIcon className="pointer-events-none" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <MinusIcon className="mr-2" />
              <span>移除</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TrashIcon className="mr-2" />
              <span>删除</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
