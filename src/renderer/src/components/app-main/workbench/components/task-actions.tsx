import {
  ArrowDownIcon,
  CopyIcon,
  DotsHorizontalIcon,
  ExternalLinkIcon,
  MinusIcon,
  PlayIcon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { match } from "ts-pattern";

import { Task } from "~/atoms/tasks";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useTaskAction } from "~/hooks/use-task-action";
import { OS } from "~/lib/os";
import { bytesToSize, extname, savePercentage } from "~/lib/utils";

import Loader from "~/assets/loader.svg?react";

export function TaskActions({ task }: { task: Task | undefined }) {
  return (
    <div className="shrink-0">
      {match(task)
        .with({ status: "waiting" }, (res) => <Waiting task={res} />)
        .with({ status: "preprocessing" }, () => <Preprocessing />)
        .with({ status: "succeed" }, (res) => <Succeed task={res} />)
        .with({ status: "failed" }, (res) => <Failed task={res} />)
        .otherwise(() => null)}
    </div>
  );
}

function Waiting({ task }: { task: Task }) {
  const { addTask } = useTaskAction();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className="w-6 h-6 px-0"
          onClick={() => addTask(task.filepath)}
        >
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
      {/* <div className="dot-rolling" /> */}
      <Loader className="animate-spin" />
    </div>
  );
}

function Succeed({ task }: { task: Extract<Task, { status: "succeed" }> }) {
  const { remove, trash, addTask } = useTaskAction();

  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        <Badge>{extname(task.outputPath)}</Badge>
        <Badge variant="outline" className="space-x-2 shrink-0">
          <span className="text-muted-foreground">
            {bytesToSize(task.outputSize)}
          </span>
          <ArrowDownIcon />
          <span>{savePercentage(task.outputSize, task.size)}</span>
        </Badge>
      </div>

      <Separator className="my-2" />

      <div className="flex items-center h-5 space-x-2">
        {OS !== "linux" && (
          <>
            <Button
              variant="ghost"
              className="w-6 h-6 px-0"
              onClick={() => {
                window.pixzip.action.copy(task.outputPath);
              }}
            >
              <CopyIcon className="pointer-events-none" />
            </Button>
            <Separator orientation="vertical" />
          </>
        )}

        <Button
          variant="ghost"
          className="w-6 h-6 px-0"
          onClick={() => window.pixzip.action.reveal(task.outputPath)}
        >
          <ExternalLinkIcon className="pointer-events-none" />
        </Button>
        <Separator orientation="vertical" />

        <Button
          variant="ghost"
          className="w-6 h-6 px-0"
          onClick={() => addTask(task.filepath)}
        >
          <ReloadIcon />
        </Button>

        <Separator orientation="vertical" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-6 h-6 px-0">
              <DotsHorizontalIcon className="pointer-events-none" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                remove(task.filepath);
              }}
            >
              <MinusIcon className="mr-2" />
              <span>移除</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => trash(task.filepath, task.outputPath)}
            >
              <TrashIcon className="mr-2" />
              <span>删除</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function Failed({ task }: { task: Task }) {
  const { remove, addTask } = useTaskAction();
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
        <Button
          variant="ghost"
          className="w-6 h-6 px-0"
          onClick={() => addTask(task.filepath)}
        >
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
            <DropdownMenuItem
              onClick={() => {
                remove(task.filepath);
              }}
            >
              <MinusIcon className="mr-2" />
              <span>移除</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
