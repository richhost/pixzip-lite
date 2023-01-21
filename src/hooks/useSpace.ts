import produce from "immer";
import { useAtom } from "jotai";
import { useDebounce } from "react-use";
import { currentSpaceIdAtom, spacesAtom } from "@/stores/space";

type FormValue = Omit<Space, "id">;

type Action = {
  key: keyof FormValue;
  value: FormValue[keyof FormValue];
};

export const useSpace = () => {
  const [spaces, setSpaces] = useAtom(spacesAtom);
  const [currentId, setCurrentId] = useAtom(currentSpaceIdAtom);

  const changeOption = (action: Action) => {
    const nextState = produce(spaces, (draft) => {
      const index = draft.findIndex((element) => element.id === currentId);
      draft[index] = { ...draft[index], [action.key]: action.value };
    });
    setSpaces(nextState);
  };

  const onOpenFolder = () => {
    window.lossApi["dialog:openFolder"]().then((path: string) => {
      if (path) {
        changeOption({ key: "outputPath", value: path });
      }
    });
  };

  const currentSpace = spaces.find((element) => element.id === currentId);

  useDebounce(
    () => {
      window.lossApi["space:patch"](spaces);
    },
    500,
    [spaces]
  );

  return {
    spaces,
    currentSpace,
    changeOption,
    currentId,
    setCurrentId,
    onOpenFolder,
  };
};
