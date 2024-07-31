<script lang="ts">
	import type { Snippet } from 'svelte';
	import { portal } from '@zag-js/svelte';
	import { getApi } from './context.svelte';

	const { children }: { children?: Snippet } = $props();

	const api = getApi();
</script>

<div use:portal {...api.getPositionerProps()}>
	<ul
		{...api.getContentProps()}
		class="w-48 p-1 bg-white focus-within:outline-0 border border-neutral-100 shadow-md rounded"
	>
		{#if children}{@render children()}{/if}
	</ul>
</div>
