import { RotateCw } from "lucide-react";
import { useAddFile } from "@/hooks/useAddFiles";

export default function ReCompress() {
  const { reCompress } = useAddFile();

  return (
    <button
      onClick={reCompress}
      title="再次压缩"
      className="text-zinc-400 w-7 h-7 flex items-center justify-center hover:bg-zinc-100 rounded-md active:bg-zinc-200 active:text-zinc-500 cursor-default recovery-drag"
    >
      <RotateCw size={16} />
    </button>
  );
}
