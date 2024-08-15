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

export class WindowCtr {
	isMax = $state(false);

	constructor() {
		$effect(() => {
			const unlisten1 = handlers.maximizeApp.listen(() => {
				this.isMax = true;
			});

			const unlisten2 = handlers.unmaximizeApp.listen(() => {
				this.isMax = false;
			});

			return () => {
				unlisten1();
				unlisten2();
			};
		});
	}
}
