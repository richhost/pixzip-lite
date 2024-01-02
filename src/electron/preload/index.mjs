import { contextBridge, ipcRenderer } from 'electron';

const ui = {
	minimize: () => ipcRenderer.send('minimize'),
	maximize: () => ipcRenderer.send('maximize'),
	unmaximize: () => ipcRenderer.send('unmaximize'),
	close: () => ipcRenderer.send('close'),
	onMaximized: (callback) => ipcRenderer.on('maximized', callback),
	onUnmaximized: (callback) => ipcRenderer.on('unmaximized', callback)
};

contextBridge.exposeInMainWorld('pixzip', {
	os: process.platform,
	ui
});
