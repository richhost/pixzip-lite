import { Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";

export function Toolbar() {
	return (
		<header className="h-[var(--h-header)] draggable px-1.5 flex items-center flex-shrink-0">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" className="no-drag" size="icon">
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
