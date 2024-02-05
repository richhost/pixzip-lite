import sharp, { FormatEnum, Sharp } from "sharp";
import { extname, basename, dirname } from "node:path";
import { existsSync, statSync } from "node:fs";
import { ensureDirSync, outputFile } from "fs-extra/esm";

import { getWorkspaces } from "../ipc/workspace";
import { delimiter, qualityMap } from "./constants";

export const getExtname = (filename: string) => {
  return extname(filename).replace(".", "").toLocaleLowerCase();
};

const animated = (filename: string) => {
  const ext = getExtname(filename);
  return ["gif", "webp"].includes(ext);
};

export const getConfig = (workspaceId: string) => {
  const configs = getWorkspaces();
  return configs.find((config) => config.id === workspaceId);
};

export const fileExists = (filepath: string) => {
  return existsSync(filepath);
};

const getFormat = (filepath: string, config: Pixzip.Workspace) => {
  const ext = getExtname(filepath);
  if (config.format === "original") return ext as unknown as keyof FormatEnum;
  return config.format as keyof FormatEnum;
};

const getQuality = (format: keyof FormatEnum, level: number) => {
  let quality = qualityMap[format];
  if (format === "gif") {
    quality = 1;
  }
  return Math.floor((11 - level) * 10 * quality);
};

const keepExif = (sharp: Sharp, config: Pixzip.Workspace) => {
  return config.keepExif ? sharp : sharp.withExif({});
};

export const zip = (filepath: string, config: Pixzip.Workspace) => {
  const needAnimated = animated(filepath);
  const format = getFormat(filepath, config);
  const quality = getQuality(format, config.level);

  const instance = sharp(filepath, { animated: needAnimated }).keepMetadata();

  return keepExif(instance, config)
    .resize({
      width: config.width,
      height: config.height,
    })
    .toFormat(format, {
      quality: quality,
      mozjpeg: format === "jpeg" || format === "jpg",
    })
    .toBuffer();
};

const outputFilepath = (filepath: string, config: Pixzip.Workspace) => {
  const ext = getExtname(filepath);
  const filename = basename(filepath, `.${ext}`);

  let outputDir = dirname(filepath);

  if (!config.originalOutput && config.outputDir) {
    outputDir = config.outputDir;
  }
  ensureDirSync(outputDir);
  return `${outputDir + delimiter + filename + config.suffix}.${
    config.format === "original" ? ext : config.format
  }`;
};

export const output = (
  buffer: Buffer,
  filepath: string,
  config: Pixzip.Workspace
) => {
  const outFilepath = outputFilepath(filepath, config);
  return new Promise<{ size: number; filepath: string }>((resolve, reject) => {
    outputFile(outFilepath, buffer)
      .then(() => {
        const size = statSync(outFilepath).size;
        resolve({
          size,
          filepath: outFilepath,
        });
      })
      .catch(() => reject());
  });
};
