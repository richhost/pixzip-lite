import React, { useRef } from "react";
import { useAtomValue, useAtom } from "jotai";
import { produce } from "immer";
import { defAtom } from "~/stores/space";
import { imgsAtom, SpaceImg } from "~/stores/img";

const isImage = (type: string): boolean => {
  const imgTypes =
    "image/avif,image/gif,image/jpeg,image/png,image/tiff,image/webp";
  return imgTypes.includes(type);
};
const isAdded = (path: string, imgs: SpaceImg[]): boolean => {
  return imgs.findIndex((element) => element.path === path) !== -1;
};

const useAddImg = () => {
  const def = useAtomValue(defAtom);
  const [imgs, setImgs] = useAtom(imgsAtom);

  const inputRef = useRef<HTMLInputElement>(null);

  const transform = (files: FileList) => {
    const data: SpaceImg[] = [];
    for (const file of files) {
      const condition1 = isImage(file.type);
      const condition2 = isAdded(
        (file as FileWithPath).path,
        imgs.get(def) || []
      );
      if (condition1 && !condition2) {
        const temp: SpaceImg = {
          path: (file as FileWithPath).path,
          name: file.name,
          size: file.size,
          type: file.type,
          spaceId: def,
          status: "waiting",
        };
        data.push(temp);
      }
    }
    return data;
  };

  const addFile = (data: SpaceImg[]) => {
    const nextState = produce(imgs, (draft) => {
      if (draft.has(def)) {
        draft.set(def, [...draft.get(def)!, ...data]);
      } else {
        draft.set(def, data);
      }
    });
    setImgs(nextState);
    window.img.addImgs(data);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    const files = e.dataTransfer.files;
    const data = transform(files);
    addFile(data);
  };

  const handleInputAddFile = () => {
    const files = inputRef.current?.files;
    if (files?.length) {
      const data = transform(files);
      addFile(data);
    }
    inputRef.current!.value = "";
  };

  const again = () => {
    const spaceImage = imgs.get(def);
    if (!spaceImage || spaceImage.length === 0) return;
    window.img.addImgs(spaceImage);
  };

  return { handleDrop, handleInputAddFile, inputRef, again };
};

export default useAddImg;
