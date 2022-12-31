import sharp from "sharp";
import { compressEmitter } from "./emitter";
import { processCommon } from "./utils";

export const gif = (file: SendFile, config: UserConfig) => {
  sharp(file.path, { animated: true })
    .resize({
      width: config.width,
      height: config.height,
    })
    .gif()
    .toBuffer()
    .then((data) => {
      processCommon(file, "gif", data, config);
    })
    .catch(() => {
      compressEmitter.emit("compress", {
        ...file,
        status: "failed",
      });
    });
};
