<script>
	import { OS } from '$lib/shared/utils';
	import Navigation from './navigation.svelte';
	import BottomBar from './bottom-bar.svelte';
</script>

<aside
	class="w-[clamp(var(--w-sidebar-min),16vw,var(--w-sidebar-max))] h-full flex flex-col shrink-0 {OS ===
	'win32'
		? 'bg-white/80'
		: ''}"
>
	<div class="h-[var(--h-title-bar)] draggable shrink-0 flex items-center">
		{#if OS !== 'darwin'}
			<span class="text-xs font-semibold ml-2">PixZip Lite</span>
		{/if}
	</div>

	<Navigation />
	<BottomBar />
</aside>
