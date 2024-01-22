import { OS } from "~/lib/os.ts";

export function Brand() {
  return (
    <div className="draggable font-bold flex items-center justify-center w-full h-[var(--h-header)] shrink-0">
      {OS !== "darwin" && "Pixzip"}
    </div>
  );
}
