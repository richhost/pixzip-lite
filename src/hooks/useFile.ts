import { useRef, DragEvent, useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { filesAtom } from "@/stores/file";
import { currentSpaceIdAtom } from "@/stores/space";
import produce from "immer";

const isImage = (type: string): boolean => {
  const imgTypes =
    "image/avif,image/gif,image/jpeg,image/png,image/tiff,image/webp";

  return imgTypes.includes(type);
};

type TheFile = Omit<
  SendFile,
  "compressedSize" | "spaceId" | "outputPath" | "status"
>;

export const useFile = () => {
  const [files, setFiles] = useAtom(filesAtom);
  const currentSpaceId = useAtomValue(currentSpaceIdAtom);

  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (theFiles: TheFile[]) => {
    const data: SendFile[] = [];
    for (const file of theFiles) {
      if (
        isImage(file.type) &&
        files.find((element) => element.path === file.path) === undefined
      ) {
        const temp: SendFile = {
          path: file.path,
          name: file.name,
          type: file.type,
          status: "waiting",
          size: file.size,
          spaceId: currentSpaceId,
        };
        data.push(temp);
      }
    }

    const nextState = produce(files, (draft) => {
      draft.push(...data);
    });
    setFiles(nextState);
    window.lossApi["file:add"](data);
  };

  const handleInputAddFile = () => {
    const files = inputRef.current?.files;
    if (!files) return;
    addFiles(files as unknown as TheFile[]);
    inputRef.current.value = "";
  };

  const handleDragFile = (evt: DragEvent<HTMLDivElement>) => {
    const files = evt.dataTransfer.files;
    addFiles(files as unknown as TheFile[]);
  };

  const changeStatus = (file: SendFile) => {
    setFiles((prevState) => {
      const nextState = produce(prevState, (draft) => {
        const index = draft.findIndex((element) => element.path === file.path);
        if (index > -1) {
          draft[index].status = file.status;

          if (file.status === "success") {
            draft[index].compressedSize = file.compressedSize;
            draft[index].outputPath = file.outputPath;
          }
        }
      });

      return nextState;
    });
  };

  const again = () => {
    const nextState = produce(files, (draft) =>
      draft.forEach((element) => {
        if (element.spaceId === currentSpaceId) {
          element.status = "waiting";
        }
      })
    );
    setFiles(nextState);

    let data: SendFile[] = [];
    for (const element of nextState) {
      if (element.spaceId === currentSpaceId) {
        const temp: SendFile = {
          name: element.name,
          path: element.path,
          size: element.size,
          type: element.type,
          spaceId: currentSpaceId,
          status: element.status,
        };
        data.push(temp);
      }
    }
    window.lossApi["file:add"](data);
  };

  const clear = () => {
    const nextState = files.filter(
      (element) => element.spaceId !== currentSpaceId
    );
    setFiles(nextState);
    window.lossApi["file:clear"](currentSpaceId);
  };

  useEffect(() => {
    window.lossApi["compress:processing"]((_: unknown, file: SendFile) => {
      changeStatus(file);
    });
    window.lossApi["compress:success"]((_: unknown, file: SendFile) => {
      changeStatus(file);
    });
    window.lossApi["compress:failed"]((_: unknown, file: SendFile) => {
      changeStatus(file);
    });

    return () => window.lossApi["compress:remove"]();
  }, []);

  return {
    files,
    inputRef,
    handleInputAddFile,
    handleDragFile,
    again,
    clear,
  };
};
