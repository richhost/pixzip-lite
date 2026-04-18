/**
 * Vite config for the Svelte renderer (PixZip Lite).
 *
 * This replaces the electron-vite renderer configuration.
 * Output is placed in `dist-renderer/` where Electrobun's build picks it up.
 */
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
	plugins: [tailwindcss(), svelte()],

	root: 'src/renderer',

	// Use relative asset paths so the output works under `views://main/`.
	base: './',

	build: {
		outDir: resolve(__dirname, 'dist-renderer'),
		emptyOutDir: true
	},

	resolve: {
		alias: {
			$: resolve(__dirname, 'src/renderer/src'),
			$lib: resolve(__dirname, 'src/renderer/src/lib')
		}
	},

	server: {
		// Vite dev server port — Electrobun loads http://localhost:5173 in dev mode.
		port: 5173,
		strictPort: true
	}
});
