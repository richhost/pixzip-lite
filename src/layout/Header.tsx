import AddFiles from "@/components/AddFiles";

import ReCompress from "@/components/ReCompress";
import ClearFiles from "@/components/ClearFiles";

export default function Header() {
  return (
    <header
      style={{ width: "calc(100% - 240px)" }}
      className="h-[50px] bg-white bg-opacity-80 fixed top-0 left-60 w-full z-10 backdrop-blur border-b window-drag flex items-center justify-end gap-2 px-5"
    >
      <AddFiles />
      <ReCompress />
      <ClearFiles />
    </header>
  );
}
