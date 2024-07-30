<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getApi } from './context.svelte';

	const { children }: { children?: Snippet } = $props();

	const api = getApi();
</script>

<div {...api.getContextTriggerProps()}>
	{#if children}
		{@render children()}
	{/if}
</div>
