import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react'
import { resolve } from 'path';
import svgr from 'vite-plugin-svgr'

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()],
		build: {
			rollupOptions: {
				output: {
					format: 'es'
				}
			}
		}
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
		build: {
			rollupOptions: {
				output: {
					format: 'es'
				}
			}
		}
	},
	renderer: {
		plugins: [react(), svgr()],
		resolve: {
			alias: {
				'~': resolve('src/renderer/src')
			}
		}
	}
});
