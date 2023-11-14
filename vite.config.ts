import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 5173,
		strictPort: true
	},
	css: {
		transformer: 'lightningcss'
	},
	build: {
		cssMinify: 'lightningcss'
	}
});
