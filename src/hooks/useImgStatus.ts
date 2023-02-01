import { useEffect } from "react";
import { useSetAtom } from "jotai";
import produce from "immer";
import { imgsAtom } from "@/stores/img";

const useImgStatus = () => {
  const setImgs = useSetAtom(imgsAtom);

  useEffect(() => {
    window.compress.start((params) => {
      setImgs((prev) => {
        const nextState = produce(prev, (draft) => {
          const spaceImgs = draft.get(params.spaceId);
          if (spaceImgs) {
            const index = spaceImgs.findIndex(
              (element) => element.path === params.path
            );
            if (index !== -1) {
              spaceImgs[index].status = "start";
            }
          }
        });
        return nextState;
      });
    });

    window.compress.success((params) => {
      setImgs((prev) => {
        const nextState = produce(prev, (draft) => {
          const spaceImgs = draft.get(params.spaceId);
          if (spaceImgs) {
            const index = spaceImgs.findIndex(
              (element) => element.path === params.path
            );
            if (index !== -1) {
              spaceImgs[index].status = "success";
              spaceImgs[index].compressedSize = params.compressedSize;
              spaceImgs[index].outputPath = params.outputPath;
            }
          }
        });
        return nextState;
      });
    });

    window.compress.failed((params) => {
      console.log("failed: ", params);
      setImgs((prev) => {
        const nextState = produce(prev, (draft) => {
          const spaceImgs = draft.get(params.spaceId)!;
          if (spaceImgs) {
            const index = spaceImgs.findIndex(
              (element) => element.path === params.path
            );
            if (index !== -1) {
              spaceImgs[index].status = "failed";
            }
          }
        });
        return nextState;
      });
    });

    return () => window.compress.removeListeners();
  }, []);
};

export default useImgStatus;
