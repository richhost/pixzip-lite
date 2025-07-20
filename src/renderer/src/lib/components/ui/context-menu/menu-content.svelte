<script lang="ts">
	import { cn } from '$lib/shared/utils';
	import { Menu } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';

	const { children, class: className }: { children?: Snippet; class?: string } = $props();
</script>

<Menu.Positioner>
	<Menu.Content
		class={cn(
			'w-48 p-1 text-sm focus-within:outline-0 border shadow-lg rounded bg-neutral-50 dark:bg-neutral-700 dark:border-neutral-100/10 border-neutral-200',
			className
		)}
	>
		{@render children?.()}
	</Menu.Content>
</Menu.Positioner>
