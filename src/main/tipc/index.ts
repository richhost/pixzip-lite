import { addSpace, getSpaces } from './space';

export const router = {
	getSpaces,
	addSpace
};

export type Router = typeof router;
