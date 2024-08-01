import { nanoid } from 'nanoid';
import { client } from '$lib/client';
import { SPACE_TEMPLATE } from '$lib/constants';
import { defaultSpaceStore, spaceStore, updateDefaultSpace } from '$lib/stores/space';

export const addSpace = () => {
	const space: Pixzip.Space = { ...SPACE_TEMPLATE, id: 'sp_' + nanoid() };
	client.addSpace({ space });
	defaultSpaceStore.setState(() => space.id);
	spaceStore.setState((prev) => [...prev, space]);
};

export const deleteSpace = (id: string) => {
	const spaces = spaceStore.state;
	if (spaces.length === 1) return;
	const defaultId = defaultSpaceStore.state;
	if (id === defaultId) {
		const index = spaces.findIndex((s) => s.id === defaultId);
		const nextIndex = index >= spaces.length - 1 ? index - 1 : index + 1;
		const nextId = spaces[nextIndex].id;
		updateDefaultSpace(nextId);
	}
	spaceStore.setState((prev) => prev.filter((s) => s.id !== id));
	client.deleteSpace({ id });
};
