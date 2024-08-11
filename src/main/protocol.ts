import { protocol } from 'electron';
import sharp from 'sharp';
import querystring from 'node:querystring';

import { delimiter } from './core/constants';

sharp.cache(false);

export async function registerProtocol() {
	protocol.handle('thumb', async (request) => {
		const replace = `thumb:${delimiter}${delimiter}`;
		const src = request.url;
		const url = src.replace(replace, '');

		const buffer = await sharp(querystring.unescape(url))
			.keepMetadata()
			.resize({ width: 128 })
			.webp({ quality: 60 })
			.toBuffer();

		return new Response(buffer, {
			status: 200
		});
	});
}
