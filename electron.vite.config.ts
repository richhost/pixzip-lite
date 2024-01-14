import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

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
		plugins: [react()],
		resolve: {
			alias: {
				'~': resolve('src/renderer/src')
			}
		}
	}
});
