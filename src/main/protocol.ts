import { protocol } from "electron";
import sharp from "sharp";
import querystring from "node:querystring";

import { delimiter } from "./core/constants";

export async function registerProtocol() {
  protocol.handle("resource", async (request) => {
    const replace = `resource:${delimiter}${delimiter}`;
    const src = request.url;
    const url = src.replace(replace, "");

    const buffer = await sharp(querystring.unescape(url))
      .resize({ width: 128 })
      .jpeg({ quality: 60 })
      .toBuffer();

    return new Response(buffer, {
      status: 200,
    });

    // return net.fetch(`file:${delimiter}${delimiter}${url}`);
  });
}
