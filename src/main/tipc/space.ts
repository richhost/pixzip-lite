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

export const getSpaces = t.procedure.action(async () => {
	const fromStore = store.get('space') as Space[];
	if (!fromStore || fromStore.length === 0) {
		store.set('space', [defaultSpace]);
		return [defaultSpace];
	}
	return fromStore;
});

export const addSpace = t.procedure.input<{ space: Space }>().action(async ({ input }) => {
	const fromStore = store.get('space') as Space[];
	fromStore.push(input.space);
	store.set('space', fromStore);
	return fromStore;
});

export const deleteSpace = t.procedure.input<{ id: string }>().action(async ({ input }) => {
	const fromStore = store.get('space') as Space[];
	const length = fromStore.length;
	if (length === 1) {
		return fromStore;
	}
	const index = fromStore.findIndex((space) => space.id === input.id);
	fromStore.splice(index, 1);
	store.set('space', fromStore);
	return fromStore;
});
