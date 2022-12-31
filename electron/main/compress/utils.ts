import fs from "fs";
import Fs from "@supercharge/fs";
import { compressEmitter } from "./emitter";

/**
 * 检测文件夹是否存在，不存在则创建
 * @param path string
 * @returns string
 */
export const folder = (path: string) => {
  if (!fs.existsSync(path)) {
    return fs.mkdirSync(path, { recursive: true });
  }
  return path;
};

/**
 * 生成文件名，文件名、后缀、拓展名
 * @param option
 * @returns string
 */
export const generateFilename = async (option: {
  filename: string;
  suffix?: string;
  extension: string;
}) => {
  let fullpath =
    option.filename + (option.suffix || "") + "." + option.extension;
  return fullpath;
};

/**
 * 比较两个文件的大小，true 说明压缩有效，false 说明压缩无效
 * @param oldPath string
 * @param newPath string
 * @returns boolean | { oldSize: number, newSize: number }
 */
export const compressed = async (file: SendFile, newPath: string) => {
  const oldSize = file.size;
  const newSize = await Fs.size(newPath);
  if (oldSize > newSize) {
    return {
      newSize,
    };
  } else {
    return false;
  }
};

/**
 * 通用处理函数
 * @param file
 * @param extension
 * @param data
 * @param config
 * @returns Promise<{ oldSize: number; newSize: number }>
 */
export const processCommon = async (
  file: SendFile,
  extension: string,
  data: Buffer,
  config: UserConfig
) => {
  // 获取文件名，不包含拓展名
  const filename = await Fs.filename(file.path);
  // 临时文件夹
  const tempDir = await Fs.tempDir();
  // 新文件名
  const newFilename = await generateFilename({
    filename,
    suffix: config.suffix,
    extension,
  });

  const newPath = tempDir + "/" + newFilename;
  await Fs.writeFile(newPath, data);
  // 是否为有效压缩
  const isCompressResult = await compressed(file, newPath);
  if (isCompressResult === false) {
    compressEmitter.emit("compress", {
      ...file,
      status: "failed",
    });
  } else {
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
    await Fs.move(newPath, outputPath);

    compressEmitter.emit("compress", {
      ...file,
      ...isCompressResult,
      status: "success",
    });
  }
};
