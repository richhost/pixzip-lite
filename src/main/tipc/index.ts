import { copyFile, folderPicker, revealWith, trashFile } from './action';
import { openFolder, scan } from './scan';
import { addSpace, deleteSpace, getSpaces, updateSpace } from './space';
import { pushTask, removeTask, emptyTask } from './task';
import { closeApp, maximizeApp, minimizeApp, unmaximizeApp } from './ui';

export const router = {
	getSpaces,
	addSpace,
	updateSpace,
	deleteSpace,
	maximizeApp,
	minimizeApp,
	unmaximizeApp,
	closeApp,
	folderPicker,
	scan,
	openFolder,
	pushTask,
	emptyTask,
	removeTask,
	revealWith,
	copyFile,
	trashFile
};

export { registerUIHandlers } from './ui';

export type Router = typeof router;
