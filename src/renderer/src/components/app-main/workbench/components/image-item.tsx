import {
	ExternalLinkIcon,
	ArrowDownIcon,
	CopyIcon,
} from "@radix-ui/react-icons";
import * as Progress from "@radix-ui/react-progress";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

export function ImageItem() {
	return (
		<div className="relative rounded-lg overflow-hidden border">
			<Progress.Root className="absolute inset-0 rounded-lg overflow-hidden">
				<Progress.Indicator
					className="w-full h-full bg-secondary opacity-50 absolute z-10"
					style={{
						transform: "translateX(0%)",
					}}
				/>
			</Progress.Root>
			<div className="relative z-10 text-sm p-3 flex flex-wrap xl:flex-nowrap items-center justify-between gap-x-5 gap-y-1">
				<div className="flex items-center gap-2 grow">
					<p className="font-medium truncate">zhanfangfweaf.jpg</p>
					<p className="flex-shrink-0 text-muted-foreground">5 MB</p>
				</div>
				<div className="flex gap-2 items-center flex-shrink-0">
					<Badge>JPG</Badge>
					<Badge variant="outline" className="space-x-2">
						<span className="text-muted-foreground">1 MB</span>
						<ArrowDownIcon />
						<span>22%</span>
					</Badge>
					<Button variant="ghost" className="w-6 h-6 px-0">
						<CopyIcon className="pointer-events-none" />
					</Button>
					<Button variant="ghost" className="w-6 h-6 px-0">
						<ExternalLinkIcon className="pointer-events-none" />
					</Button>
				</div>
			</div>
		</div>
	);
}
