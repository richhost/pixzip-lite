import sharp from "sharp";
import { compressEmitter } from "./emitter";
import { processCommon } from "./utils";

export const png = (file: SendFile, config: UserConfig) => {
  sharp(file.path)
    .resize({
      width: config.width,
      height: config.height,
    })
    .png({ quality: Math.floor((10 - config.quality) * 10) })
    .toBuffer()
    .then((data) => {
      processCommon(file, "png", data, config);
    })
    .catch(() => {
      compressEmitter.emit("compress", {
        ...file,
        status: "failed",
      });
    });
};
