import { tipc } from '@egoist/tipc/main';
import { dialog } from 'electron';

const t = tipc.create();

export const folderPicker = t.procedure.action(async () => {
	const { filePaths } = await dialog.showOpenDialog({
		properties: ['openDirectory']
	});
	return filePaths;
});
