import windowStateKeeper from 'electron-window-state';
import { BrowserWindow, app } from 'electron';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';
import { loadDevServer } from './dev-server.mjs';

async function createWindow() {
	const mainWindowState = windowStateKeeper({
		defaultWidth: 800,
		defaultHeight: 600
	});

	const browserWindow = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		frame: platform() !== 'linux',
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			sandbox: false,
			preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url))
		}
	});

	if (!app.isPackaged) {
		loadDevServer()
			.then((url) => {
				browserWindow.loadURL(url);
			})
			.then(() => browserWindow.webContents.openDevTools());
		//		browserWindow
		//			.loadURL('http://localhost:5173')
		//			.then(() => browserWindow.webContents.openDevTools());
	} else {
		// TODO
	}

	mainWindowState.manage(browserWindow);
	return browserWindow;
}

/** @type {import('electron').BrowserWindow | undefined} */
let browserWindow;

export async function restoreOrCreateWindow() {
	browserWindow = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

	if (browserWindow === undefined) {
		browserWindow = await createWindow();
	}

	if (browserWindow.isMinimizable()) {
		browserWindow.restore();
	}

	return browserWindow;
}

export function getMainWindow() {}
