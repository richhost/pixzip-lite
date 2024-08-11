import { store } from '../utils/store';
import { tipc } from '@egoist/tipc/main';

const t = tipc.create();

type Space = Pixzip.Space;

const defaultSpace: Space = {
	id: 'space_default',
	name: 'Space',
	width: undefined,
	height: undefined,
	suffix: '-min',
	format: 'original',
	level: 1,
	originalOutput: true,
	outputDir: '',
	keepExif: false
};

const KEY = 'spaces';

export const getSpacesFromStore = () => {
	let wks: Space[] = [];
	const fromStore = store.get(KEY);
	if (fromStore) {
		wks = fromStore as Space[];
	} else {
		wks = [defaultSpace];
		store.set(KEY, wks);
	}
	return wks;
};

export const getSpaces = t.procedure.action(async () => {
	return getSpacesFromStore();
});

export const addSpace = t.procedure.input<{ space: Space }>().action(async ({ input }) => {
	const fromStore = store.get(KEY) as Space[];
	fromStore.push(input.space);
	store.set(KEY, fromStore);
	return fromStore;
});

export const deleteSpace = t.procedure.input<{ id: string }>().action(async ({ input }) => {
	const fromStore = store.get(KEY) as Space[];
	const length = fromStore.length;
	if (length === 1) {
		return fromStore;
	}
	const index = fromStore.findIndex((space) => space.id === input.id);
	fromStore.splice(index, 1);
	store.set(KEY, fromStore);
	return fromStore;
});

export const updateSpace = t.procedure.input<{ space: Space }>().action(async ({ input }) => {
	const fromStore = store.get(KEY) as Space[];
	const index = fromStore.findIndex((space) => space.id === input.space.id);
	fromStore[index] = input.space;
	store.set(KEY, fromStore);
	return fromStore;
});
