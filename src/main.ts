import 'the-new-css-reset';
import './app.css';
import { createRoot } from 'svelte';
import App from './app.svelte';

const app = createRoot(App, { target: document.getElementById('app')! });

export default app;
