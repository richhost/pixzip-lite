<script lang="ts">
	import type { Snippet } from 'svelte';
	import { portal } from '@zag-js/svelte';
	import { cn } from '$lib/shared/utils';
	import { getMenuContext } from './context';

	const { children, class: className }: { children?: Snippet; class?: string } = $props();

	const menuContext = getMenuContext();
</script>

<div use:portal {...menuContext.api.getPositionerProps()}>
	<ul
		{...menuContext.api.getContentProps()}
		class={cn(
			'w-48 p-1 text-sm focus-within:outline-0 border shadow-lg rounded bg-neutral-50 dark:bg-neutral-700 dark:border-neutral-100/10 border-neutral-200',
			className
		)}
	>
		{@render children?.()}
	</ul>
</div>
