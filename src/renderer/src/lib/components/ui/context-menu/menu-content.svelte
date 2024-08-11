<script lang="ts">
	import type { Snippet } from 'svelte';
	import { portal } from '@zag-js/svelte';
	import { getApi } from './context.svelte';
	import { cn } from '$lib/utils';

	const { children, class: className }: { children?: Snippet; class?: string } = $props();

	const api = getApi();
</script>

<div use:portal {...api.getPositionerProps()}>
	<ul
		{...api.getContentProps()}
		class={cn(
			'w-48 p-1 bg-white text-sm focus-within:outline-0 border border-neutral-200 shadow-lg rounded',
			className
		)}
	>
		{@render children?.()}
	</ul>
</div>
