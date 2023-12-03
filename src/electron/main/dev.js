import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';

export async function loadDevServer() {
	const server = await createServer({
		configFile: fileURLToPath(new URL('../../../vite.config.ts', import.meta.url))
	});

	await server.listen();

	const conf = server.config.server;

	const protocol = conf.https ? 'https' : 'http';
	const host = conf.host ?? 'localhost';
	const port = conf.port;

	process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL = `${protocol}://${host}:${port}`;
	return `${protocol}://${host}:${port}`;
}
