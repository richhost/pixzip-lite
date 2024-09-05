import { client } from '$lib/client';
import { defaultSpaceStore, spaceStore } from '$lib/stores/space';
import { useStore } from '@tanstack/svelte-store';

export class DragFile {
	private spaceId = useStore(defaultSpaceStore);
	private spaces = useStore(spaceStore);

	private space = $derived.by(() => {
		return this.spaces.current.find((element) => element.id === this.spaceId.current);
	});

	ondragover = (e: DragEvent) => e.preventDefault();

	ondrop = (e: DragEvent) => {
		if (!this.space) return;
		e.preventDefault();
		e.stopPropagation();

		const files = e.dataTransfer?.files ?? [];
		const directory: string[] = [];
		for (let i = 0; i < files.length; i++) {
			const path = window.pixzip.getPathForFile(files[i]);
			directory.push(path);
		}
		client.scan({ directory });
	};
}
