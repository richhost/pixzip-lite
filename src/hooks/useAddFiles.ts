import { useRecoilState } from "recoil";
import { useRef, DragEvent } from "react";
import { filesStore, fileStatusStore } from "@/stores/file";

const isImage = (type: string): boolean => {
  const imgTypes =
    "image/avif,image/gif,image/jpeg,image/png,image/tiff,image/webp";

  return imgTypes.includes(type);
};

export const useAddFile = () => {
  const [fileMap, setFileMap] = useRecoilState(fileStatusStore);
  const [files, setFiles] = useRecoilState(filesStore);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList) => {
    const canPush: SendFile[] = [];

    for (let file of files) {
      const currentFile = file as unknown as SendFile;

      if (isImage(currentFile.type) && !fileMap.has(currentFile.path)) {
        canPush.push({
          name: currentFile.name,
          path: currentFile.path,
          type: currentFile.type,
          size: currentFile.size,
        });

        setFileMap(
          new Map(fileMap.set(currentFile.path, { status: "waiting" }))
        );
      }
    }

    window.lossApi["file:add"](canPush);
    setFiles((prev) => [...prev, ...canPush]);
  };

  const handleInputAddFile = () => {
    const files = inputRef.current?.files;
    if (!files) return;
    addFiles(files);
  };

  const handleDragFile = (evt: DragEvent<HTMLDivElement>) => {
    const files = evt.dataTransfer.files;
    addFiles(files);
  };

  const reCompress = () => {
    if (files.length) {
      window.lossApi["file:add"](files);
    }
  };

  return { files, inputRef, handleInputAddFile, handleDragFile, reCompress };
};
