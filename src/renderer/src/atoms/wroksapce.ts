import { atomWithStorage } from "jotai/utils";

export const currentWksID = atomWithStorage<string | undefined>(
  "currentWksID",
  undefined,
);
