<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getMenuContext } from './context';

	const { children }: { children?: Snippet } = $props();

	const menuContext = getMenuContext();
</script>

<div {...menuContext.api.getContextTriggerProps()}>
	{@render children?.()}
</div>
