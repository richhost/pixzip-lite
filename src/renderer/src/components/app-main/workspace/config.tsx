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

export function Config() {
	return (
		<div className="min-h-0">
			<ScrollArea className="h-full">
				<div className="space-y-5 p-4">
					<div className="grid w-full items-center gap-2">
						<Label htmlFor="width">宽</Label>
						<Input type="number" id="width" min={1} placeholder="自动" />
					</div>

					<div className="grid w-full items-center gap-2">
						<Label htmlFor="height">高</Label>
						<Input type="number" id="height" min={1} placeholder="自动" />
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

					<div className="grid w-full items-center gap-4">
						<Label htmlFor="level">压缩强度：</Label>
						<Slider id="level" min={1} max={9} defaultValue={[1]} />
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
