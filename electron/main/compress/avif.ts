import sharp from "sharp";
import { compressEmitter } from "./emitter";
import { processCommon } from "./utils";

export const avif = (file: SendFile, config: IUserConfig) => {
  sharp(file.path)
    .resize({
      width: config.width,
      height: config.height,
    })
    .avif({ quality: Math.floor((10 - config.quality) * 10 * 0.7) })
    .toBuffer()
    .then((data) => {
      processCommon(file, "avif", data, config);
    })
    .catch(() => {
      compressEmitter.emit("compress", {
        ...file,
        status: "failed",
      });
    });
};
