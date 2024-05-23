import { readFileSync } from "node:fs";
import { decompressFrames, parseGIF } from "gifuct-js";

export function getGifFrameCount(filepath: string) {
  const buffer = readFileSync(filepath);

  const gif = parseGIF(buffer);
  const frames = decompressFrames(gif, true);

  return frames.length;
}
