import { app, Menu } from 'electron';
import { registerIpcMain } from '@egoist/tipc/main';
import {
	registerHandlers,
	registerWorkspaceHandlers,
	registerUIHandlers,
	registerTaskHandlers
} from './ipc';
import { restoreOrCreateWindow } from './window';
import { registerProtocol } from './protocol';
import { router } from './tipc';

app.on('window-all-closed', () => {
	app.quit();
});

if (process.platform !== 'darwin') {
	app.commandLine.appendSwitch('--enable-features', 'FluentOverlayScrollbar');
}

app
	.whenReady()
	.then(registerProtocol)
	.then(restoreOrCreateWindow)
	.then((browserWindow) => {
		registerUIHandlers(browserWindow);
		registerWorkspaceHandlers();
		registerTaskHandlers();
		registerHandlers();
	})
	.catch((e) => console.error('create window failed: ', e));

const menus = Menu.buildFromTemplate([
	{
		label: app.getName(),
		submenu: [
			{
				label: 'About',
				role: 'about'
			}
		]
	}
]);
Menu.setApplicationMenu(menus);
app.setAboutPanelOptions({
	applicationName: app.getName(),
	applicationVersion: app.getVersion(),
	version: ''
});

registerIpcMain(router);
