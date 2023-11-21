import windowStateKeeper from 'electron-window-state';
import { BrowserWindow, app } from 'electron';
import { fileURLToPath } from 'node:url';

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
		webPreferences: {
			preload: fileURLToPath(new URL('../preload/index.cjs', import.meta.url))
		}
	});

	function loadDevServer() {
		browserWindow
			.loadURL('http://localhost:5173')
			.then(() => {
				browserWindow.webContents.openDevTools();
			})
			.catch((e) => {
				console.log('Error loading dev server: ', e);
				setTimeout(() => {
					loadDevServer();
				}, 500);
			});
	}

	if (!app.isPackaged) {
		loadDevServer();
	} else {
		// TODO
	}

	mainWindowState.manage(browserWindow);
	return browserWindow;
}

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
