import { tipc, getRendererHandlers } from '@egoist/tipc/main';
import type { BrowserWindow } from 'electron';
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
	window.minimize();
});

export const closeApp = t.procedure.action(async () => {
	const window = await getMainWindow();
	window.close();
});

export const registerUIHandlers = (window: BrowserWindow) => {
	const handlers = getRendererHandlers<RendererHandlers>(window.webContents);

	window.on('maximize', () => {
		handlers.maximizeApp.send();
	});
	window.on('unmaximize', () => {
		handlers.unmaximizeApp.send();
	});
};
