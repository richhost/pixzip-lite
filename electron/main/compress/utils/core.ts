import sharp, { FormatEnum } from "sharp";
import Fs from "@supercharge/fs";
import userConfig from "../../config/user-config";

/**
 * 生成文件名，文件名、后缀、拓展名 e.g. picture-mini.avif
 * @param option
 * @returns string
 */
async function generateFilename(option: {
  filename: string;
  suffix?: string;
  extension: string;
}) {
  let fullpath =
    option.filename + (option.suffix || "") + "." + option.extension;
  return fullpath;
}

/**
 * 比较两个文件的大小，true 说明压缩有效，false 说明压缩无效
 * @param oldPath string
 * @param newPath string
 * @returns boolean | { oldSize: number, newSize: number }
 */
async function compressed(file: SendFile, newPath: string) {
  const oldSize = file.size;
  const newSize = await Fs.size(newPath);
  if (oldSize > newSize) {
    return {
      newSize,
    };
  } else {
    return false;
  }
}

/**
 * 获取输出的图片格式
 * @param file
 * @returns
 */
function getFormatType(file: SendFile) {
  let format = userConfig.config.format;

  const extension = file.name
    .substring(file.name.lastIndexOf(".") + 1)
    .toLocaleLowerCase();

  if (format === "original") {
    format = extension as Format;
  }

  return {
    original: extension,
    format,
  };
}

/**
 * 输出的图片质量
 * @param format
 * @param configQuality
 * @returns
 */
function quality(format: Format, configQuality: number) {
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

/**
 * 处理压缩逻辑
 * @param file
 * @returns
 */
export const compressCore = (file: SendFile) => {
  return new Promise((resolve, reject) => {
    const { format, original } = getFormatType(file);

    let animated = false;
    if (format !== "avif" && (original === "gif" || original === "webp")) {
      animated = true;
    }

    const config = userConfig.config;

    sharp(file.path, { animated })
      .resize({
        width: config.width,
        height: config.height,
      })
      .toFormat(format as keyof FormatEnum, {
        quality: quality(format, config.quality),
      })
      .toBuffer()
      .then(async (data) => {
        // 获取文件名，不包含拓展名
        const filename = await Fs.filename(file.path);
        // 临时文件夹
        const tempDir = await Fs.tempDir();
        // 新文件名
        const newFilename = await generateFilename({
          filename,
          suffix: config.suffix,
          extension: format,
        });

        // 保存临时文件
        const tempPath = tempDir + "/" + newFilename;
        await Fs.writeFile(tempPath, data);

        // 是否为有效压缩
        const compressValid = await compressed(file, tempPath);
        if (compressValid === false) {
          // 压缩失败，删除临时文件
          await Fs.remove(tempPath);
          reject(false);
        }

        // 压缩成功
        let outputPath = "";
        if (config.outputOriginal) {
          // 保存到原文件夹
          outputPath = await Fs.dirname(file.path);
        } else {
          outputPath = config.outputPath;
          if (!outputPath) outputPath = await Fs.dirname(file.path);
        }
        outputPath = outputPath + "/" + newFilename;

        if (await Fs.exists(outputPath)) {
          // 存在则删除文件
          await Fs.remove(outputPath);
        }
        // 将临时文件移动到目标文件
        await Fs.move(tempPath, outputPath);

        resolve(compressValid);
      })
      .catch(() => {
        reject(false);
      });
  });
};
