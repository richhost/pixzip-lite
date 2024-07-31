import { addSpace, getSpaces } from './space';
import { closeApp, maximizeApp, minimizeApp, unmaximizeApp } from './ui';

export const router = {
	getSpaces,
	addSpace,
	maximizeApp,
	minimizeApp,
	unmaximizeApp,
	closeApp
};

export type Router = typeof router;
