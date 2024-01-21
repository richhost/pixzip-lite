import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";

import { Workbench } from "./workbench";
import { Workspace } from "./workspace";

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
