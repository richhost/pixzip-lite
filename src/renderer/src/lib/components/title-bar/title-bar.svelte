<script lang="ts">
	import { OS } from '~/lib/utils';
	import WindowCtr from './window-ctr.svelte';
	import Toolbar from './toolbar.svelte';
</script>

<div class="draggable flex h-[var(--h-title-bar)]">
	<div class="relative grow flex items-center justify-center">
		<div class="w-[clamp(var(--w-config-min),16vw,var(--w-config-max))] mr-4"></div>
		<Toolbar />

		{#if OS !== 'darwin'}<WindowCtr />{/if}
	</div>
</div>
