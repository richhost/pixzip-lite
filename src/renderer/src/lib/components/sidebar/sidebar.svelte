<script>
	import { OS } from '$lib/utils';
	import Navigation from './navigation.svelte';
	import BottomBar from './bottom-bar.svelte';
</script>

<aside
	class="w-[clamp(var(--w-sidebar-min),16vw,var(--w-sidebar-max))] h-full flex flex-col shrink-0"
>
	{#if OS === 'darwin'}
		<div class="h-[var(--h-title-bar)] draggable shrink-0"></div>
	{/if}
	<Navigation />
	<BottomBar />
</aside>
