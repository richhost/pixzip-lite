import sharp, { FormatEnum } from "sharp";
import Fs from "@supercharge/fs";

const delimiter = process.platform === "win32" ? "\\" : "/";

async function getOutputFilename(img: TaskImg) {
  const filename = await Fs.filename(img.name);
  const format = await getFormat(img);
  return filename + (img.config.suffix || "") + "." + format;
}

function getQuality(format: Format, configQuality: number) {
  switch (format) {
    case "jpg":
      return Math.floor((10 - configQuality) * 10 * 0.8);
    case "png":
      return Math.floor((10 - configQuality) * 10);
    case "webp":
      return Math.floor((10 - configQuality) * 10 * 0.7);
    case "avif":
      return Math.floor((10 - configQuality) * 10 * 0.7);
    case "gif":
      return undefined;
    default:
      return Math.floor((10 - configQuality) * 10);
  }
}

async function getExtension(filename: string) {
  return await Fs.extension(filename).toLocaleLowerCase();
}

async function needAnimated(img: TaskImg) {
  const extension = await getExtension(img.name);
  const formatAnimated =
    img.config.format === "gif" || img.config.format === "webp";
  const inputAnimated = extension === "gif" || extension === "webp";

  return formatAnimated && inputAnimated;
}

async function getFormat(img: TaskImg): Promise<Omit<Format, "original">> {
  let format = img.config.format;
  if (format === "original") {
    format === (await getExtension(img.name));
  }
  return format;
}

export const compress = async (img: TaskImg) => {
  const animated = await needAnimated(img);
  const format = await getFormat(img);
  const quality = getQuality(img.config.format, img.config.quality);
  return sharp(img.path, { animated })
    .resize({
      width: img.config.width,
      height: img.config.height,
    })
    .toFormat(format as keyof FormatEnum, { quality })
    .toBuffer();
};

export const operate = (
  buffer: Promise<Buffer>,
  img: TaskImg
): Promise<{ outputPath: string; compressedSize: number }> => {
  return new Promise((resolve, reject) => {
    buffer
      .then(async (data) => {
        const outputFilename = await getOutputFilename(img);
        const tempDir = await Fs.tempDir();
        const tempFullname = tempDir + delimiter + outputFilename;
        await Fs.writeFile(tempFullname, data);

        const compressedSize = await Fs.size(tempFullname);
        if (compressedSize < img.size) {
          // compress success
          let outputPath = img.config.outputPath;
          if (img.config.outputOriginal)
            outputPath = await Fs.dirname(img.path);
          if (!outputPath) outputPath = await Fs.dirname(img.path);

          outputPath += delimiter + outputFilename;

          if (Fs.existsSync(outputPath)) Fs.removeSync(outputPath);
          Fs.moveSync(tempFullname, outputFilename);

          resolve({
            outputPath,
            compressedSize,
          });
        }
        // compress failed
        Fs.remove(tempFullname);
        reject();
      })
      .catch(() => reject());
  });
};
