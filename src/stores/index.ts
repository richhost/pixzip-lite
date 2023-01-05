import { atom } from "jotai";

export const filesAtom = atom<SendFile[]>([]);
export const fileStatusAtom = atom<
  Map<SendFile["path"], { status: ProcessStatus; size?: number }>
>(new Map());
