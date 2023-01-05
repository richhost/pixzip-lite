import { useRef, DragEvent } from "react";
import { useAtom } from "jotai";
import { filesAtom, fileStatusAtom } from "@/stores";

const isImage = (type: string): boolean => {
  const imgTypes =
    "image/avif,image/gif,image/jpeg,image/png,image/tiff,image/webp";

  return imgTypes.includes(type);
};

export const useAddFile = () => {
  const [files, setFiles] = useAtom(filesAtom);
  const [fileStatusMap, setFileStatusMap] = useAtom(fileStatusAtom);

  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList) => {
    const canPush: SendFile[] = [];

    for (let file of files) {
      const currentFile = file as unknown as SendFile;

      if (isImage(currentFile.type) && !fileStatusMap.has(currentFile.path)) {
        canPush.push({
          name: currentFile.name,
          path: currentFile.path,
          type: currentFile.type,
          size: currentFile.size,
        });

        setFileStatusMap(
          new Map(fileStatusMap.set(currentFile.path, { status: "waiting" }))
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
