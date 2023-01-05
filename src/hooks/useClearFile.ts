import { useSetAtom } from "jotai";
import { filesAtom, fileStatusAtom } from "@/stores";

export const useClearFile = () => {
  const setFiles = useSetAtom(filesAtom);
  const setFileStatusMap = useSetAtom(fileStatusAtom);

  const clearFile = () => {
    window.lossApi["file:clear"]();
    setFiles([]);
    setFileStatusMap(new Map());
  };

  return { clearFile };
};
