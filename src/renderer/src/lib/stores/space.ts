import { client } from '$lib/client';
import { DEFAULT_SPACE } from '$lib/constants';
import { Store } from '@tanstack/svelte-store';

export const getDefaultSpace = () => {
	return window.localStorage.getItem(DEFAULT_SPACE);
};

export const spaceStore = new Store<Pixzip.Space[]>([]);

export const defaultSpaceStore = new Store<string | undefined>(undefined);

client.getSpaces().then((spaces) => {
	let defaultId = getDefaultSpace();
	if (!defaultId) {
		defaultId = spaces[0].id;
	} else {
		const target = spaces.find((element) => element.id === defaultId);
		if (!target) defaultId = spaces[0].id;
	}
	updateDefaultSpace(defaultId);
	spaceStore.setState(() => spaces);
});

export const updateDefaultSpace = (id: string) => {
	window.localStorage.setItem(DEFAULT_SPACE, id);
	defaultSpaceStore.setState(() => id);
};

export const updateSpace = (space: Pixzip.Space) => {
	client.updateSpace({ space });
	spaceStore.setState((prev) => {
		const index = prev.findIndex((s) => s.id === space.id);
		if (index !== -1) prev[index] = space;
		return [...prev];
	});
};
