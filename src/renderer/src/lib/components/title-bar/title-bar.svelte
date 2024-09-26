<script lang="ts">
	import { OS } from '$lib/shared/utils';
	import WindowCtr from './window-ctr.svelte';
	import Toolbar from './toolbar.svelte';
</script>

<div class="draggable flex h-[var(--h-title-bar)] shrink-0 bg-neutral-100 dark:bg-neutral-700">
	<div class="relative grow flex items-center justify-center">
		<Toolbar />

		{#if OS !== 'darwin'}
			<WindowCtr />
		{/if}
	</div>
</div>
