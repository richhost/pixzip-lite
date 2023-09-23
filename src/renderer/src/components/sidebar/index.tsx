import * as Popover from "@radix-ui/react-popover";
import "./index.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="workspace_input">
        <Popover.Root>
          <Popover.Trigger asChild>
            <button>icon</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>
              <div>hello</div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <input type="text" />
      </div>
    </div>
  );
}

export default Sidebar;
