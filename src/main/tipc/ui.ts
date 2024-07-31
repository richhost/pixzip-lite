import { tipc } from '@egoist/tipc/main';
import { getMainWindow } from '../window';

const t = tipc.create();

export const maximizeApp = t.procedure.action(async () => {
	const window = await getMainWindow();

	window.maximize();
});

export const unmaximizeApp = t.procedure.action(async () => {
	const window = await getMainWindow();
	window.unmaximize();
});

export const minimizeApp = t.procedure.action(async () => {
	const window = await getMainWindow();
	console.log('min------', window);
	window.minimize();
});

export const closeApp = t.procedure.action(async () => {
	const window = await getMainWindow();
	window.close();
});
