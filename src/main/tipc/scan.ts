import { getRendererHandlers, tipc } from '@egoist/tipc/main';
import { getMainWindow } from '../window';
import { getImageExtensions } from '../constants';
import { type BrowserWindow, dialog } from 'electron';
import { scanDirectory } from '../helper/scan-img';

const handleScan = (directory: string[], window: BrowserWindow) => {
	let result: FileInfo[] = [];

	for (let i = 0; i < directory.length; i++) {
		result = result.concat(scanDirectory(directory[i]));
	}

	const handlers = getRendererHandlers<RendererHandlers>(window.webContents);
	handlers.scanned.send(result);
};

const t = tipc.create();

export const scan = t.procedure.input<{ directory: string[] }>().action(async ({ input }) => {
	const mainWindow = await getMainWindow();
	handleScan(input.directory, mainWindow);
});

export const openFolder = t.procedure.input().action(async () => {
	const mainWindow = await getMainWindow();
	const extensions = getImageExtensions();
	const path = dialog.showOpenDialogSync(mainWindow, {
		properties: ['openDirectory', 'openFile', 'multiSelections'],
		filters: [{ name: 'Images', extensions }]
	});
	if (path) {
		handleScan(path, mainWindow);
	}
});
