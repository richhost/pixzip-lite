import { ScrollArea } from "~/components/ui/scroll-area";

import { HeadBar } from "./head-bar";
import { ImageItem } from "./image-item";
import { Empty } from "./empty";

export function Workbench() {
  return (
    <section className="flex flex-col h-full">
      <HeadBar />
      <Empty />
      {/* <ScrollArea className="h-full">
        <div className="space-y-2 p-4">
          <ImageItem />
        </div>
      </ScrollArea> */}
    </section>
  );
}
