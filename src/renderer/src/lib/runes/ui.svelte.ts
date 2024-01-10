import { untrack } from 'svelte';

export function createUI() {
	let maximized = $state(false);

	$effect(() => {
		untrack(() => {
			window.pixzip.ui.onMaximized(() => (maximized = true));
			window.pixzip.ui.onUnmaximized(() => (maximized = false));
		});

		return () => {
			window.pixzip.ui.removeListeners();
		};
	});

	function maximizeApp() {
		window.pixzip.ui.maximize();
	}
	function minimizeApp() {
		window.pixzip.ui.minimize();
	}
	function closeApp() {
		window.pixzip.ui.close();
	}
	function unmaximizeApp() {
		window.pixzip.ui.unmaximize();
	}

	return {
		get maximized() {
			return maximized;
		},
		maximizeApp,
		minimizeApp,
		closeApp,
		unmaximizeApp
	};
}
