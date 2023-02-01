import { atom } from "jotai";

export type SpaceImg = Img & {
  status: ImgStatus;
  outputPath?: string;
  compressedSize?: number;
};

type ImgsAtom = Map<Space["id"], SpaceImg[]>;

export const imgsAtom = atom<ImgsAtom>(new Map());
