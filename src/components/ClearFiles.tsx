import { Eraser } from "lucide-react";
import { useClearFile } from "@/hooks/useClearFile";

export default function ClearFiles() {
  const { clearFile } = useClearFile();

  return (
    <button
      onClick={clearFile}
      title="清空列表"
      className="text-zinc-400 w-7 h-7 flex items-center justify-center hover:bg-zinc-100 rounded-md active:bg-zinc-200 active:text-zinc-500 cursor-default recovery-drag"
    >
      <Eraser size={16} />
    </button>
  );
}
