import { protocol } from "electron";
import sharp from "sharp";
import querystring from "node:querystring";

import { delimiter } from "./core/constants";

sharp.cache(false);

export async function registerProtocol() {
  protocol.handle("resource", async (request) => {
    const replace = `resource:${delimiter}${delimiter}`;
    const src = request.url;
    const url = src.replace(replace, "");

    const buffer = await sharp(querystring.unescape(url))
      .keepMetadata()
      .resize({ width: 128 })
      .jpeg({ quality: 60, mozjpeg: true })
      .toBuffer();

    return new Response(buffer, {
      status: 200,
    });
  });
}
