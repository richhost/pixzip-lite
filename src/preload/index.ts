import { contextBridge, webUtils } from 'electron';
import { type ElectronAPI, electronAPI } from '@electron-toolkit/preload';

const api = { ...electronAPI, getPathForFile: webUtils.getPathForFile };

if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld('pixzip', api);
	} catch (error) {
		console.error(error);
	}
} else {
	window.pixzip = api;
}

declare global {
	interface Window {
		pixzip: ElectronAPI & { getPathForFile: typeof webUtils.getPathForFile };
	}
}
