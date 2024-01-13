import 'the-new-css-reset';

/** radix color */
import '@radix-ui/colors/gray.css';

/** Open props */
import 'open-props/easings.min.css';

/** fonts */
import '@fontsource-variable/inter';

import './app.css';

import { createRoot } from 'svelte';
import App from './App.svelte';

const app = createRoot(App, { target: document.getElementById('app')! });

export default app;
