import { addSpace, deleteSpace, getSpaces } from './space';
import { closeApp, maximizeApp, minimizeApp, unmaximizeApp } from './ui';

export const router = {
	getSpaces,
	addSpace,
	deleteSpace,
	maximizeApp,
	minimizeApp,
	unmaximizeApp,
	closeApp
};

export { registerUIHandlers } from './ui';

export type Router = typeof router;
