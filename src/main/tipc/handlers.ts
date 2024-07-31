import { getRendererHandlers } from '@egoist/tipc/main';
import type { BrowserWindow } from 'electron';

export const registerHandlers = (window: BrowserWindow) => {
	const handlers = getRendererHandlers<RendererHandlers>(window.webContents);

	console.log('=======', handlers);

	window.on('maximize', () => {
		console.log('==max==');
		handlers.maximizeApp.send();
	});
	window.on('unmaximize', () => {
		console.log('un max');
		handlers.unmaximizeApp.send();
	});
};
