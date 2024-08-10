import { formDataSchema, SpaceFormData } from '$lib/schema';
import { defaultSpaceStore, spaceStore, updateSpace } from '$lib/stores/space';
import { useStore } from '@tanstack/svelte-store';

export function useConfig() {
	const spaces = useStore(spaceStore);
	const spaceId = useStore(defaultSpaceStore);

	const getFormData = () => spaces.current.find((s) => s.id === spaceId.current);

	const formData = $derived.by(getFormData);

	const update = (key: keyof SpaceFormData, value: SpaceFormData[keyof SpaceFormData]) => {
		const valid = formDataSchema.parse({ ...formData, [key]: value });
		updateSpace(valid);
	};

	$inspect('inner', formData);

	return {
		getFormData,
		update
	};
}
