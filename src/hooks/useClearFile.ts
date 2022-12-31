import { filesStore, fileStatusStore } from "@/stores/file";
import { useSetRecoilState } from "recoil";

export const useClearFile = () => {
  const setFileMap = useSetRecoilState(fileStatusStore);
  const setFiles = useSetRecoilState(filesStore);

  const clearFile = () => {
    window.lossApi["file:clear"]();
    setFiles([]);
    setFileMap(new Map());
  };

  return { clearFile };
};
