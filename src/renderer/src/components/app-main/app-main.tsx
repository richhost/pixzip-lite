import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { Workspace } from "./workspace";

export function AppMain() {
	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
				<Workspace />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={70}>
				<div className="flex h-full items-center justify-center p-6">
					<span className="font-semibold">Content</span>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
