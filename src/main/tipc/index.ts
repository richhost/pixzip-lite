import { folderPicker } from './action';
import { addSpace, deleteSpace, getSpaces, updateSpace } from './space';
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
	folderPicker
};

export { registerUIHandlers } from './ui';

export type Router = typeof router;
