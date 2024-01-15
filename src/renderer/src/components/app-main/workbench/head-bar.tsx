import { WindowCtr } from "./window-ctr";
import { OS } from "~/lib/os";

export function HeadBar() {
	return (
		<header className="flex items-center h-[var(--h-header)] draggable justify-end">
			{OS !== "darwin" && <WindowCtr />}
		</header>
	);
}
