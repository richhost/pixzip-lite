import { client } from '$lib/client';
import { handlers } from '$lib/handlers';

export const minimizeFn = () => {
	client.minimizeApp();
};

export const maximizeFn = () => {
	client.maximizeApp();
};

export const closeFn = () => {
	client.closeApp();
};

export const useWindowState = () => {
	let isMax = $state({ value: false });

	$effect(() => {
		const unlisten = handlers.maximizeApp.listen(() => {
			console.log('=---max');
			isMax.value = true;
		});

		return unlisten;
	});

	$effect(() => {
		const unlisten = handlers.unmaximizeApp.listen(() => {
			console.log('un max');
			isMax.value;
		});
		return unlisten;
	});

	return isMax;
};
