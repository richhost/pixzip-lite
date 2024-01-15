import { PropsWithChildren, useRef } from "react";
import { useAtom } from "jotai";
import { useScroll } from "ahooks";

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
import { cn } from "~/lib/utils";

import { scrollAtom } from "./atom";

export function Configure() {
	const [position, setPosition] = useAtom(scrollAtom);

	const scrollAreaRef = useRef<HTMLDivElement>(null);

	const scroll = useScroll(() => {
		return scrollAreaRef.current?.querySelector(
			"[data-radix-scroll-area-viewport]",
		) as HTMLDivElement;
	});

	if (scroll !== position) {
		setPosition(scroll);
	}

	return (
		<div
			className={cn("min-h-0", {
				"border-t": scroll?.top,
			})}
		>
			<ScrollArea className="h-full" ref={scrollAreaRef}>
				<div className="p-4 space-y-8">
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
