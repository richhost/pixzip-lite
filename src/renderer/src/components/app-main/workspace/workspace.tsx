import { Configure } from "./configure";
import { Toolbar } from "./toolbar";

export function Workspace() {
	return (
		<section className="flex flex-col h-full bg-gray-50">
			<Toolbar />
			<Configure />
		</section>
	);
}
