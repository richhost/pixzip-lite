import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		postcss: {
			plugins: [tailwind(), autoprefixer()]
		}
	}
});
