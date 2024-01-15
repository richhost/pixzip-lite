import { atom } from "jotai";

export type Scroll = { top: number; left: number } | undefined;

export const scrollAtom = atom<Scroll>(undefined);
