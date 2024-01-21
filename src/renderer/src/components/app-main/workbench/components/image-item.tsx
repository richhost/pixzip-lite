import {
  ArrowDownIcon,
  CopyIcon,
  Cross1Icon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import * as Progress from "@radix-ui/react-progress";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

export function ImageItem() {
  return (
    <div className="relative rounded-lg overflow-hidden border">
      <Progress.Root className="absolute inset-0 rounded overflow-hidden">
        <Progress.Indicator
          className="w-full h-full bg-secondary absolute z-10"
          style={{
            transform: "translateX(60%)",
          }}
        />
      </Progress.Root>
      <div className="relative z-10 text-sm p-3 flex items-center justify-between gap-x-5 gap-y-2">
        <figure className="flex items-center gap-4">
          <img
            src="https://picsum.photos/200"
            alt="img"
            className="w-12 h-12 rounded-lg aspect-square"
          />
          <figcaption className="min-w-0">
            <p className="font-medium truncate">lorem_picsum.jpg</p>
            <p className="text-muted-foreground">5M</p>
          </figcaption>
        </figure>

        <div className="flex gap-2 items-center shrink-0">
          <Badge>JPG</Badge>
          <Badge variant="outline" className="space-x-2">
            <span className="text-muted-foreground">1 MB</span>
            <ArrowDownIcon />
            <span>22%</span>
          </Badge>
          <div className="flex items-center gap-1">
            <Button variant="ghost" className="w-6 h-6 px-0">
              <Cross1Icon className="pointer-events-none" />
            </Button>
            <Button variant="ghost" className="w-6 h-6 px-0">
              <CopyIcon className="pointer-events-none" />
            </Button>
            <Button variant="ghost" className="w-6 h-6 px-0">
              <ExternalLinkIcon className="pointer-events-none" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
