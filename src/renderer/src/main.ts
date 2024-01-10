import 'the-new-css-reset';

/** radix color */
import '@radix-ui/colors/gray.css';

/** Open props */
import 'open-props/easings.min.css';

import './app.css';
import { createRoot } from 'svelte';
import App from './app.svelte';

const app = createRoot(App, { target: document.getElementById('app')! });

export default app;
