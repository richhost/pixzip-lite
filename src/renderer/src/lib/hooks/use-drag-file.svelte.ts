import { client } from '$lib/client';
import { defaultSpaceStore, spaceStore } from '$lib/stores/space';
import { useStore } from '@tanstack/svelte-store';

export function useDragFile() {
	const ondragover = (e: DragEvent) => e.preventDefault();
	const spaceId = useStore(defaultSpaceStore);
	const spaces = useStore(spaceStore);

	const space = $derived.by(() => {
		return spaces.current.find((element) => element.id === spaceId.current);
	});

	const ondrop = (e: DragEvent) => {
		if (!space) return;
		e.preventDefault();
		e.stopPropagation();

		const files = e.dataTransfer?.files ?? [];
		const directory: string[] = [];
		for (let i = 0; i < files.length; i++) {
			directory.push(files[i].path);
		}
		client.scan({ directory });
	};

	return {
		ondragover,
		ondrop
	};
}
