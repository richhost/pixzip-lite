import { client, handlers } from '$lib/client';

export const minimizeFn = () => {
	client.minimizeApp();
};

export const maximizeFn = () => {
	client.maximizeApp();
};

export const unmaximizeFn = () => {
	client.unmaximizeApp();
};

export const closeFn = () => {
	client.closeApp();
};

export const useWindowState = () => {
	let isMax = $state({ current: false });

	$effect(() => {
		const unlisten1 = handlers.maximizeApp.listen(() => {
			isMax.current = true;
		});

		const unlisten2 = handlers.unmaximizeApp.listen(() => {
			isMax.current = false;
		});

		return () => {
			unlisten1();
			unlisten2();
		};
	});

	return isMax;
};
