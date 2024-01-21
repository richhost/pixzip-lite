import { Brand } from "./brand";
import { Nav } from "./nav";

export function Sidebar() {
  return (
    <div className="flex flex-col h-full">
      <Brand />
      <Nav />
    </div>
  );
}
