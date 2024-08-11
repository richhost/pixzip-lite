<script lang="ts">
	import TitleBar from '$lib/components/title-bar/title-bar.svelte';
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';
	import { cn } from '$lib/shared/utils';
	import Panel from '$lib/components/panel/panel.svelte';
	import Stage from '$lib/components/stage/stage.svelte';
	import { useScan } from '$lib/hooks/use-scan.svelte';
	import { useTaskScheduler } from '$lib/hooks/use-task-scheduler.svelte';

	useScan();
	useTaskScheduler();
</script>

<div class="h-screen bg-neutral-50 rounded-md flex overflow-hidden text-neutral-900 text-sm">
	<Sidebar />
	<div class="grow flex flex-col">
		<TitleBar />

		<div
			class={cn(
				'border border-neutral-200/70 border-r-transparent overflow-hidden rounded-l-3xl grow flex',
				{}
			)}
		>
			<section
				class="w-[clamp(var(--w-config-min),16vw,var(--w-config-max))] m-2 rounded-2xl border bg-white border-neutral-200/80 shrink-0"
			>
				<Panel />
			</section>

			<section
				class="grow flex flex-col m-2 ml-0 border border-neutral-200/80 bg-white rounded-2xl overflow-y-auto"
			>
				<Stage />
			</section>
		</div>
	</div>
</div>
