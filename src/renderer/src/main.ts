import { mount } from 'svelte';
import App from './app.svelte';
import './app.css';
import { client } from '$lib/client';
import { initThumbPort } from '$lib/shared/utils';

// Fetch the thumbnail server port bun is listening on, then mount the app.
// We do this first so thumbImg() works correctly before any images are loaded.
client.getThumbPort().then((port) => {
	initThumbPort(port);
});

const app = mount(App, {
	target: document.getElementById('app')!
});

export default app;
