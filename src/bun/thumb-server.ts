/**
 * Local HTTP server for serving on-the-fly WebP thumbnails.
 * Replaces the Electron `thumb://` custom protocol which is not available in Electrobun.
 *
 * The server starts on a random OS-assigned port.  The port number is exposed
 * through `getThumbPort()` so the renderer can construct thumbnail URLs like:
 *   http://localhost:<port>/?path=<encoded-filepath>
 */
import sharp from 'sharp';

let thumbPort = 0;

export function startThumbServer(): number {
	const server = Bun.serve({
		port: 0, // let OS assign an available port
		async fetch(req) {
			// Allow CORS so the webview (views:// origin) can load images
			const corsHeaders = {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET'
			};

			if (req.method === 'OPTIONS') {
				return new Response(null, { status: 204, headers: corsHeaders });
			}

			const url = new URL(req.url);
			const filepath = url.searchParams.get('path');

			if (!filepath) {
				return new Response('Missing path parameter', { status: 400, headers: corsHeaders });
			}

			try {
				const buffer = await sharp(decodeURIComponent(filepath))
					.keepMetadata()
					.resize({ width: 128 })
					.webp({ quality: 60 })
					.toBuffer();

				return new Response(buffer, {
					status: 200,
					headers: {
						...corsHeaders,
						'Content-Type': 'image/webp',
						'Cache-Control': 'public, max-age=3600'
					}
				});
			} catch (e) {
				return new Response('Failed to generate thumbnail', { status: 500, headers: corsHeaders });
			}
		}
	});

	thumbPort = server.port ?? 0;
	console.log(`[thumb-server] Listening on port ${thumbPort}`);
	return thumbPort;
}

export function getThumbPort(): number {
	return thumbPort;
}
