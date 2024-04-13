import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Button } from "~/components/ui/button";
import { OS } from "~/lib/os.ts";

export function Brand() {
  return (
    <div className="draggable relative font-bold flex items-center justify-center w-full h-[var(--h-header)] shrink-0">
      {OS !== "darwin" && "Pixzip"}
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            className="no-drag cursor-default absolute right-1 top-2.5 w-6 h-6"
            size="icon"
          >
            <DotsHorizontalIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Pixzip</DrawerTitle>
            <DrawerDescription>
              面向现代 Web 应用的开源图片压缩软件
            </DrawerDescription>
            <div className="pt-4 text-sm">
              本应用不会联网，所以不会收集任何用户信息。若要更新应用，请前往
              <a
                href="https://xiangsu.fun"
                onClick={(e) => {
                  e.preventDefault();
                  window.pixzip.action.openUrl("https://xiangsu.fun");
                }}
                className="underline underline-offset-4 px-1"
              >
                官网
              </a>
              或
              <a
                href="https://github.com/richhost/pixzip/releases"
                onClick={(e) => {
                  e.preventDefault();
                  window.pixzip.action.openUrl(
                    "https://github.com/richhost/pixzip/releases"
                  );
                }}
                className="underline underline-offset-4 px-1"
              >
                GitHub
              </a>
              下载最新版本。
            </div>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
