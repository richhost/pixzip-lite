import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";

import { Workspace } from "./workspace";
import { Workbench } from "./workbench";

export function AppMain() {
	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
				<Workspace />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={70}>
				<Workbench />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
