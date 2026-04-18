/**
 * Space CRUD RPC handlers.
 * Replaces src/main/tipc/space.ts — uses the bun-native JSON store.
 */
import { store } from '../store';

type Space = Pixzip.Space;

const DEFAULT_SPACE: Space = {
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

export function getSpacesFromStore(): Space[] {
	const fromStore = store.get(KEY);
	if (fromStore) return fromStore as Space[];
	const initial = [DEFAULT_SPACE];
	store.set(KEY, initial);
	return initial;
}

export const spaceHandlers = {
	getSpaces(): Space[] {
		return getSpacesFromStore();
	},

	addSpace({ space }: { space: Space }): Space[] {
		const spaces = store.get(KEY) as Space[];
		spaces.push(space);
		store.set(KEY, spaces);
		return spaces;
	},

	updateSpace({ space }: { space: Space }): Space[] {
		const spaces = store.get(KEY) as Space[];
		const index = spaces.findIndex((s) => s.id === space.id);
		if (index !== -1) spaces[index] = space;
		store.set(KEY, spaces);
		return spaces;
	},

	deleteSpace({ id }: { id: string }): Space[] {
		const spaces = store.get(KEY) as Space[];
		if (spaces.length === 1) return spaces;
		const index = spaces.findIndex((s) => s.id === id);
		if (index !== -1) spaces.splice(index, 1);
		store.set(KEY, spaces);
		return spaces;
	}
};
