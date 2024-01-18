import { CameraIcon, RocketIcon } from "@radix-ui/react-icons";

import { ScrollArea } from "~/components/ui/scroll-area";

export function Nav() {
	return (
		<ScrollArea>
			<nav className="space-y-2 p-1 text-sm">
				<NavItem />
				<NavItem />
			</nav>
		</ScrollArea>
	);
}

function NavItem() {
	return (
		<button
			type="button"
			className="flex w-full items-center justify-between gap-3 px-1 py-2 rounded cursor-default hover:bg-secondary font-semibold"
		>
			<div className="flex min-w-0 items-center gap-2">
				<CameraIcon className="shrink-0" />
				<span className="min-w-0 truncate">HelloHelloHelloHelloHello</span>
			</div>
			<div className="shrink-0">4</div>
		</button>
	);
}
