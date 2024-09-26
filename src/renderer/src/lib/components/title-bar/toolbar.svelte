<script lang="ts">
	import { client } from '$lib/client';
	import { getOutputPath, getTargetExtname } from '$lib/shared/task';
	import { defaultSpaceStore, spaceStore } from '$lib/stores/space';
	import { emptyTaskWithSpaceId, taskStore } from '$lib/stores/task';
	import { useStore } from '@tanstack/svelte-store';
	import { Plus, Play, Eraser } from 'lucide-svelte';

	const spaceId = useStore(defaultSpaceStore);

	const emptyTask = () => {
		if (!spaceId.current) return;
		emptyTaskWithSpaceId(spaceId.current);
	};

	const start = () => {
		const space = spaceStore.state.find((element) => element.id === spaceId.current);
		if (!space) return;

		taskStore.setState((prev) => {
			const taskMap = prev.task;
			const list = taskMap.get(space.id) ?? [];
			const processingTask: ProcessingTask[] = [];
			list.forEach((element) => {
				const outputPath = getOutputPath(element.filepath, space);
				processingTask.push({
					spaceId: space.id,
					filepath: element.filepath,
					status: 'processing',
					outputPath,
					fileSize: element.fileSize,
					extname: element.extname,
					targetExtname: getTargetExtname(element.filepath, space)
				});
			});
			taskMap.set(space.id, processingTask);
			client.pushTask({ task: processingTask });
			return { task: new Map(taskMap) };
		});
	};
</script>

<div class="flex items-center gap-0.5">
	<button
		onclick={client.openFolder}
		class="h-7 w-7 transition hover:bg-neutral-200 hover:dark:bg-neutral-100/10 grid place-items-center rounded"
	>
		<Plus class="w-5 h-5" strokeWidth="1.5" />
	</button>

	<button
		onclick={start}
		class="h-7 w-7 transition hover:bg-neutral-200 hover:dark:bg-neutral-100/10 grid place-items-center rounded"
	>
		<Play class="w-4 h-4" strokeWidth="1.5" />
	</button>

	<button
		onclick={emptyTask}
		class="h-7 w-7 transition hover:bg-neutral-200 hover:dark:bg-neutral-100/10 grid place-items-center rounded"
	>
		<Eraser class="w-4 h-4" strokeWidth="1.5" />
	</button>
</div>
