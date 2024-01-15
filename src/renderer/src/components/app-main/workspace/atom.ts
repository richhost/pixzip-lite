import { atom } from "jotai";
import { useScroll } from "ahooks";

type Scroll = ReturnType<typeof useScroll>;

export const scrollAtom = atom<Scroll>(undefined);
