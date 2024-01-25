import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { delimiter } from "./os";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseImg(filepath: string) {
  return `resource:${delimiter}${delimiter}${filepath}`;
}
