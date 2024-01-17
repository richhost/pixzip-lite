import { Eraser, Plus, RotateCw } from "lucide-react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { OS } from "~/lib/os";

import { WindowCtr } from "./window-ctr";

export function HeadBar() {
	return (
		<header className="flex items-center h-[var(--h-header)] draggable justify-between flex-shrink-0">
			<TooltipProvider>
				<div className="px-1.5 space-x-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								className="no-drag cursor-default"
								size="icon"
							>
								<Plus size={16} className="no-drag" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>添加图片</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								className="no-drag cursor-default"
								size="icon"
							>
								<RotateCw size={16} className="no-drag" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>再次压缩</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								className="no-drag cursor-default"
								size="icon"
							>
								<Eraser size={16} className="no-drag" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>清空列表</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</TooltipProvider>
			{OS !== "darwin" && <WindowCtr />}
		</header>
	);
}
