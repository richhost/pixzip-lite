import sharp from "sharp";
import { compressEmitter } from "./emitter";
import { processCommon } from "./utils";

export const jpg = (file: SendFile, config: IUserConfig) => {
  sharp(file.path)
    .resize({
      width: config.width,
      height: config.height,
    })
    .jpeg({ quality: Math.floor((10 - config.quality) * 10 * 0.8) })
    .toBuffer()
    .then((data) => {
      processCommon(file, "jpg", data, config);
    })
    .catch(() => {
      compressEmitter.emit("compress", {
        ...file,
        status: "failed",
      });
    });
};
