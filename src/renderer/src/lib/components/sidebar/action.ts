import { client } from '$lib/client';
import { SPACE_TEMPLATE } from '$lib/constants';
import { defaultSpaceStore, spaceStore } from '$lib/stores/space';
import { nanoid } from 'nanoid';

export const addSpace = () => {
	const space: Pixzip.Space = { ...SPACE_TEMPLATE, id: 'sp_' + nanoid() };
	client.addSpace({ space });
	defaultSpaceStore.setState(() => space.id);
	spaceStore.setState((prev) => [...prev, space]);
};

export const deleteSpace = (id: string) => {};
