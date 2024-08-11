<script lang="ts">
	import { useDragFile } from '$lib/hooks/use-drag-file.svelte';
	import { useStore } from '@tanstack/svelte-store';
	import FileItem from './file-item.svelte';
	import { taskStore } from '$lib/stores/task';
	import { defaultSpaceStore } from '$lib/stores/space';
	import Empty from './empty.svelte';

	const { ondragover, ondrop } = useDragFile();

	const tasks = useStore(taskStore);
	const spaceId = useStore(defaultSpaceStore);

	const list = $derived.by(() => {
		if (!spaceId.current) return [];
		return tasks.current.task.get(spaceId.current) ?? [];
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="grow flex flex-col" {ondrop} {ondragover} style="content-visibility: 'auto';">
	{#if list.length === 0}
		<Empty />
	{:else}
		{#each list as item}
			<FileItem file={item} />
		{/each}
	{/if}
</div>
