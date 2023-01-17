import { atom } from "jotai";

const initSpace: Space = {
  id: "1",
  icon: "StarIcon",
  format: "original",
  quality: 2,
  outputOriginal: true,
};

export const spacesAtom = atom<Space[]>([]);
export const currentSpaceIdAtom = atom("1");
