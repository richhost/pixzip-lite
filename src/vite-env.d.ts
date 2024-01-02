/// <reference types="svelte" />
/// <reference types="vite/client" />

interface Window {
	pixzip: {
		ui: {
			minimize: Function;
			maximize: Function;
			unmaximize: Function;
			close: Function;
			onMaximized: (callback: Function) => void;
			onUnmaximized: (callback: Function) => void;
		};
	};
}
