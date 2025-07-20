<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/shared/utils';

	type Props = {} & Menu.ItemProps;

	const { class: className, ...arkProps }: Props = $props();
</script>

<Menu.Item
	class={cn(
		'h-7 rounded flex items-center px-2 data-[highlighted]:bg-neutral-200 dark:data-[highlighted]:bg-neutral-600 dark:data-[disabled]:text-neutral-500',
		className
	)}
	{...arkProps}
/>
