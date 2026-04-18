import type { ElectrobunConfig } from 'electrobun';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default {
	app: {
		name: 'PixZip Lite',
		identifier: 'com.pixzip.lite',
		version: pkg.version
	},
	runtime: {
		exitOnLastWindowClosed: true
	},
	build: {
		bun: {
			entrypoint: 'src/bun/index.ts'
		},
		views: {
			// Electrobun bundles the bridge preload using its own Bun bundler so
			// that `electrobun/view` can be resolved correctly at runtime.
			bridge: {
				entrypoint: 'src/views/bridge/preload.ts',
				define: {
					// Inject the target platform into the bridge so the renderer
					// can read `window.pixzip.process.platform` without an RPC call.
					__PIXZIP_PLATFORM__: JSON.stringify(process.platform)
				}
			}
		},
		// Copy the Vite-built renderer output into the views/main directory.
		// `vite build` is chained in the npm scripts before electrobun build/dev.
		copy: {
			'dist-renderer/index.html': 'views/main/index.html',
			'dist-renderer/assets': 'views/main/assets'
		},
		// Ignore Vite output in watch mode — HMR handles view rebuilds separately.
		watchIgnore: ['dist-renderer/**'],
		mac: {
			icons: 'resources/icons/mac'
		}
	}
} satisfies ElectrobunConfig;
