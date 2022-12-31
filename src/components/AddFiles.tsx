import { Plus } from "lucide-react";
import { useAddFile } from "@/hooks/useAddFiles";

export default function AddFiles() {
  const { inputRef, handleInputAddFile } = useAddFile();

  return (
    <label
      title="添加图片"
      className="text-zinc-400 w-7 h-7 flex items-center justify-center hover:bg-zinc-100 rounded-md active:bg-zinc-200 active:text-zinc-500 recovery-drag"
    >
      <Plus size={18} />
      <input
        ref={inputRef}
        onChange={handleInputAddFile}
        type="file"
        accept="image/avif, image/jpeg, image/png, image/tiff, image/webp, image/gif"
        multiple
        hidden
        className="hidden"
      />
    </label>
  );
}
