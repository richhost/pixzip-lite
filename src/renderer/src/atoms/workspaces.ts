import { atomWithStorage } from "jotai/utils";

export const currentWksIDAtom = atomWithStorage<string | undefined>(
  "currentWksID",
  undefined,
);
