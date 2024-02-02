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
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

export function basename(path: string) {
  return path.split(delimiter).pop();
}

export function extname(path: string) {
  return path.split(".").pop();
}

export function dirname(path: string) {
  return path.split(delimiter).slice(0, -1).join(delimiter);
}

export function savePercentage(current: number, total: number) {
  const percent = ((total - current) / total) * 100;
  return `${Math.round(percent) === 100 ? 99 : Math.round(percent)}%`;
}

export const filePromise = (file: FileSystemFileEntry) => {
  return new Promise<File>((resolve, reject) => {
    file.file(resolve, reject);
  });
};

export const readEntriesPromise = (reader: FileSystemDirectoryReader) => {
  return new Promise<FileSystemEntry[]>((resolve, reject) => {
    reader.readEntries(resolve, reject);
  });
};
