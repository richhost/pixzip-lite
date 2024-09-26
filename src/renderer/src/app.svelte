<script lang="ts">
	import TitleBar from '$lib/components/title-bar/title-bar.svelte';
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';
	import { cn } from '$lib/shared/utils';
	import Panel from '$lib/components/panel/panel.svelte';
	import Stage from '$lib/components/stage/stage.svelte';
	import { Scan } from '$lib/runes/scan.svelte';
	import { TaskScheduler } from '$lib/runes/task-scheduler.svelte';

	new Scan();
	new TaskScheduler();
</script>

<div class="h-screen flex overflow-hidden text-neutral-900 dark:text-neutral-300 text-sm">
	<Sidebar />

	<div
		class="grow flex border-l border-neutral-900/10 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-800"
	>
		<section class="w-[clamp(var(--w-config-min),16vw,var(--w-config-max))] shrink-0 flex flex-col">
			<Panel />
		</section>

		<div
			class={cn(
				'overflow-hidden grow flex flex-col border-l border-neutral-200 dark:border-neutral-100/10',
				{}
			)}
		>
			<TitleBar />

			<section class="grow flex flex-col overflow-y-auto">
				<Stage />
			</section>
		</div>
	</div>
</div>
