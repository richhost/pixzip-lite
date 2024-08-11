import { tipc } from '@egoist/tipc/main';
import { app, dialog, shell } from 'electron';
import { loadClipboardEx } from '../helper';

const t = tipc.create();

export const folderPicker = t.procedure.action(async () => {
	const { filePaths } = await dialog.showOpenDialog({
		properties: ['openDirectory']
	});
	return filePaths;
});

export const revealWith = t.procedure.input<{ filepath: string }>().action(async ({ input }) => {
	shell.showItemInFolder(input.filepath);
});

export const copyFile = t.procedure.input<{ filepath: string }>().action(async ({ input }) => {
	if (process.platform !== 'linux') {
		loadClipboardEx().then(({ writeFilePaths }) => {
			writeFilePaths([input.filepath]);
		});
	}
});

export const trashFile = t.procedure.input<{ filepath: string }>().action(async ({ input }) => {
	shell.trashItem(input.filepath);
});

export const getVersion = t.procedure.action(async () => {
	return app.getVersion();
});
