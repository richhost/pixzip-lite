import produce from "immer";
import { useAtom } from "jotai";
import { useDebounce } from "react-use";
import { currentSpaceIdAtom, spacesAtom } from "@/stores/space";

export const useSpace = () => {
  const [spaces, setSpaces] = useAtom(spacesAtom);
  const [currentId] = useAtom(currentSpaceIdAtom);

  const changeSpaceName = (name: string) => {
    const nextState = produce(spaces, (draft) => {
      draft.forEach((element) => {
        if (element.id === currentId) {
          element.name = name;
        }
      });
    });
    setSpaces(nextState);
  };

  useDebounce(
    () => {
      window.lossApi["space:patch"](spaces);
    },
    500,
    [spaces]
  );

  return { changeSpaceName };
};
