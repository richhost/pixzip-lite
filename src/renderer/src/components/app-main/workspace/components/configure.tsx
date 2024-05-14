import { useAtom } from "jotai";
import { type PropsWithChildren, type UIEvent, useRef } from "react";

import { useWorkspaceConfig } from "~/components/app-main/workspace/hooks/use-workspace-config.ts";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { WorkspaceIcon } from "~/components/ui/workspace-icon";
import { Switch } from "~/components/ui/switch";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { scrollAtom } from "../atom";
import { formatMap, iconsMap } from "../constants";

export function Configure() {
  const [position, setPosition] = useAtom(scrollAtom);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setPosition({
      top: target.scrollTop,
      left: target.scrollLeft,
    });
  };

  const { formData, settingFormData, selectOutputDir } = useWorkspaceConfig();

  return (
    <div
      className={cn("min-h-0", {
        "border-t": position?.top,
      })}
    >
      <ScrollArea className="h-full" ref={scrollAreaRef} onScroll={onScroll}>
        <div className="p-4 space-y-8">
          <div className="flex w-full gap-2">
            <div className="grid gap-2">
              <Label>图标</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="outline">
                    <WorkspaceIcon name={formData.icon} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <div className="grid grid-cols-6 gap-1">
                    {iconsMap.map((icon) => (
                      <Button
                        key={icon}
                        variant="ghost"
                        className="shrink-0 cursor-default p-0 !w-full !h-full aspect-square active:text-foreground/50 transition-all duration-75"
                        onPointerDown={() => {
                          settingFormData({ ...formData, icon });
                        }}
                      >
                        <WorkspaceIcon width="15" height="15" name={icon} />
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="name">名称</Label>
              <Input
                type="text"
                id="name"
                placeholder="空间名称"
                value={formData.name ?? ""}
                onChange={(event) => {
                  settingFormData({ ...formData, name: event.target.value });
                }}
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="width">宽</Label>
            <Input
              type="number"
              id="width"
              min={1}
              placeholder="自动"
              value={formData.width ?? ""}
              onChange={(event) => {
                if (event.target.value === "") {
                  settingFormData({ ...formData, width: undefined });
                } else if (!Object.is(event.target.valueAsNumber, Number.NaN)) {
                  settingFormData({
                    ...formData,
                    width: event.target.valueAsNumber,
                  });
                }
              }}
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="height">高</Label>
            <Input
              type="number"
              id="height"
              min={1}
              placeholder="自动"
              value={formData.height ?? ""}
              onChange={(event) => {
                if (event.target.value === "") {
                  settingFormData({ ...formData, height: undefined });
                } else if (!Object.is(event.target.valueAsNumber, Number.NaN)) {
                  settingFormData({
                    ...formData,
                    height: event.target.valueAsNumber,
                  });
                }
              }}
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="suffix">文件后缀</Label>
            <Input
              type="text"
              id="suffix"
              min={1}
              value={formData.suffix ?? ""}
              onChange={(event) => {
                settingFormData({
                  ...formData,
                  suffix: event.target.value,
                });
              }}
            />
            <Description>
              original_filename
              <span className="text-destructive">{formData.suffix}</span>
              .jpg
            </Description>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="format">输出格式</Label>
            <Select
              value={formData.format}
              onValueChange={(value) => {
                settingFormData({
                  ...formData,
                  format: value as Pixzip.Format,
                });
              }}
            >
              <SelectTrigger id="format">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {formatMap.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="quality">
              压缩强度：
              <span>{formData.level}</span>
            </Label>
            <Slider
              id="quality"
              min={1}
              max={9}
              defaultValue={[1]}
              className="my-2"
              value={[formData.level]}
              onValueChange={([value]) => {
                settingFormData({
                  ...formData,
                  level: value,
                });
              }}
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label>保存到</Label>
            <RadioGroup
              className="my-2"
              value={formData.originalOutput ? "original" : "custom"}
              onValueChange={(value) => {
                settingFormData({
                  ...formData,
                  originalOutput: value === "original",
                });
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="original" id="originalDir" />
                <Label htmlFor="originalDir">原目录</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="customDir" />
                <Label htmlFor="customDir">自定义</Label>
              </div>
            </RadioGroup>
            {!formData.originalOutput && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      value={formData.outputDir}
                      readOnly
                      placeholder="点击选择文件夹"
                      onClick={selectOutputDir}
                    />
                  </TooltipTrigger>
                  {formData.outputDir && (
                    <TooltipContent>{formData.outputDir}</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="grid gap-2">
            <Label>EXIF</Label>
            <div className="flex gap-4 items-start justify-between">
              <Description>保留 EXIF 数据</Description>
              <Switch
                checked={formData.keepExif}
                onCheckedChange={(checked) => {
                  settingFormData({
                    ...formData,
                    keepExif: checked,
                  });
                }}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>自动执行</Label>
            <div className="flex gap-4 items-start justify-between">
              <Description>添加图片后自动压缩</Description>
              <Switch
                checked={formData.autoExec}
                onCheckedChange={(checked) => {
                  settingFormData({
                    ...formData,
                    autoExec: checked,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function Description({ children }: PropsWithChildren) {
  return <p className="text-[0.8rem] text-muted-foreground">{children}</p>;
}
