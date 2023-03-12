import { useAtomValue } from "jotai";
import { defAtom } from "~/stores/space";
import { imgsAtom } from "~/stores/img";

const useSpaceImg = () => {
  const def = useAtomValue(defAtom);
  const imgs = useAtomValue(imgsAtom);
  return imgs.get(def) || [];
};

export default useSpaceImg;
