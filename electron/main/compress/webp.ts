import sharp from "sharp";
import { compressEmitter } from "./emitter";
import { processCommon } from "./utils";

export const webp = (file: SendFile, config: UserConfig) => {
  sharp(file.path)
    .resize({
      width: config.width,
      height: config.height,
    })
    .webp({ quality: Math.floor((10 - config.quality) * 10 * 0.7) })
    .toBuffer()
    .then((data) => {
      processCommon(file, "webp", data, config);
    })
    .catch(() => {
      compressEmitter.emit("compress", {
        ...file,
        status: "failed",
      });
    });
};
