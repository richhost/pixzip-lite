import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { delimiter } from "./os";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseImg(filepath: string) {
  return `resource:${delimiter}${delimiter}${filepath}`;
}

export function bytesToSize(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / 1024 ** i)} ${sizes[i]}`;
}

export function basename(path: string) {
  return path.split(delimiter).pop();
}

export function extname(path: string) {
  return path.split(".").pop();
}
