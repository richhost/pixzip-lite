<script lang="ts">
	import { ContextMenu, type ContextMenuItemProps } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { cn } from '~/lib/utils';

	type Props = {
		children?: Snippet;
		class?: string;
	} & ContextMenuItemProps;

	const { children, class: className, ...rest }: Props = $props();
</script>

<ContextMenu.Item
	{...rest}
	class={cn('h-7 flex items-center hover:bg-neutral-100 rounded transition', className)}
>
	{#if children}{@render children()}{/if}
</ContextMenu.Item>
