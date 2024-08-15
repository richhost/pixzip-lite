import { formDataSchema, SpaceFormData } from '$lib/schema';
import { defaultSpaceStore, spaceStore, updateSpace } from '$lib/stores/space';
import { useStore } from '@tanstack/svelte-store';
import { getContext, setContext } from 'svelte';

export class SpaceConfig {
	private spaces = useStore(spaceStore);
	private spaceId = useStore(defaultSpaceStore);

	formData = $derived.by(() => {
		return this.spaces.current.find((element) => element.id === this.spaceId.current);
	});

	update = (key: keyof SpaceFormData, value: SpaceFormData[keyof SpaceFormData]) => {
		const valid = formDataSchema.parse({ ...this.formData, [key]: value });
		updateSpace(valid);
	};
}

const SPACE_CONFIG_KEY = Symbol('space-config');

export function setSpaceConfig() {
	return setContext(SPACE_CONFIG_KEY, new SpaceConfig());
}

export function getSpaceConfig() {
	return getContext<ReturnType<typeof setSpaceConfig>>(SPACE_CONFIG_KEY);
}
