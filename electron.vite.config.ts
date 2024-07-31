import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
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
		plugins: [svelte(), tailwindcss()],
		resolve: {
			alias: {
				$: resolve('src/renderer/src'),
				$lib: resolve('src/renderer/src/lib')
			}
		}
	}
});
