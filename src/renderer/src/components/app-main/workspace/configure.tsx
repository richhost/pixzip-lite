import { type PropsWithChildren, type UIEvent, useRef } from "react";
import { useAtom } from "jotai";

import { ScrollArea } from "~/components/ui/scroll-area";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

import { scrollAtom } from "./atom";
import { Button } from "~/components/ui/button";

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

	return (
		<div
			className={cn("min-h-0", {
				"border-t": position?.top,
			})}
		>
			<ScrollArea className="h-full" ref={scrollAreaRef} onScroll={onScroll}>
				<div className="p-4 space-y-8">
					<div className="grid grid-cols-3 w-full gap-2">
						<div className="grid gap-2">
							<Label>图标</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button>hello</Button>
								</PopoverTrigger>
								<PopoverContent align="start">
									Place content for the popover here.
								</PopoverContent>
							</Popover>
						</div>
						<div className="grid w-full items-center gap-2 col-span-2">
							<Label htmlFor="name">名称</Label>
							<Input type="text" id="name" placeholder="空间名称" />
						</div>
					</div>

					<div className="grid w-full items-center gap-2">
						<Label htmlFor="width">宽</Label>
						<Input type="number" id="width" min={1} placeholder="自动" />
						<Description>你可以调整图片宽，否则将保持不变。</Description>
					</div>

					<div className="grid w-full items-center gap-2">
						<Label htmlFor="height">高</Label>
						<Input type="number" id="height" min={1} placeholder="自动" />
						<Description>你可以调整图片高，否则将保持不变。</Description>
					</div>

					<div className="grid w-full items-center gap-2">
						<Label htmlFor="suffix">文件后缀</Label>
						<Input
							type="text"
							id="suffix"
							min={1}
							placeholder=""
							defaultValue="-mini"
						/>
						<Description>
							original_filename<span className="text-destructive">-mini</span>
							.jpg
						</Description>
					</div>

					<div className="grid w-full items-center gap-2">
						<Label htmlFor="format">输出格式</Label>
						<Select>
							<SelectTrigger id="format">
								<SelectValue placeholder="" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="origin">原格式</SelectItem>
								<SelectItem value="webp">WebP</SelectItem>
								<SelectItem value="avif">AVIF</SelectItem>
								<SelectItem value="jpg">JPG</SelectItem>
								<SelectItem value="png">PNG</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="grid w-full items-center gap-2">
						<Label htmlFor="level">压缩强度</Label>
						<Slider
							id="level"
							min={1}
							max={9}
							defaultValue={[1]}
							className="my-2"
						/>
					</div>

					<div className="grid w-full items-center gap-2">
						<Label>保存到</Label>
						<RadioGroup defaultValue="option-one" className="my-2">
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="option-one" id="option-one" />
								<Label htmlFor="option-one">原目录</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="option-two" id="option-two" />
								<Label htmlFor="option-two">自定义</Label>
							</div>
						</RadioGroup>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}

function Description({ children }: PropsWithChildren) {
	return <p className="text-[0.8rem] text-muted-foreground">{children}</p>;
}
