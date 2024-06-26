import { Store } from "@tanstack/react-store";
import { getDefaultSpace, setDefaultSpace } from "~/helpers/space";

export const defaultSpaceStore = new Store(getDefaultSpace());

export const updateDefaultSpace = (id: string) => {
  defaultSpaceStore.setState(() => {
    setDefaultSpace(id);
    return id;
  });
};
