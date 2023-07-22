import { useAtom, useAtomValue } from "jotai";
import { produce } from "immer";
import { defAtom } from "~/stores/space";
import { imgsAtom } from "~/stores/img";

const useClearImg = () => {
  const def = useAtomValue(defAtom);
  const [imgs, setImgs] = useAtom(imgsAtom);

  const onClear = () => {
    window.img.clearImgs(def);
    const nextState = produce(imgs, (draft) => {
      draft.delete(def);
    });
    setImgs(nextState);
  };

  return { onClear };
};

export default useClearImg;
