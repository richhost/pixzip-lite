<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as menu from '@zag-js/menu';
	import { cn } from '$lib/shared/utils';
	import { getMenuContext } from './context';

	type Props = {
		children?: Snippet;
		class?: string;
	} & menu.ItemProps;

	const { children, class: className, ...rest }: Props = $props();

	const menuContext = getMenuContext();
</script>

<li
	{...menuContext.api.getItemProps(rest)}
	class={cn(
		'h-7 rounded flex items-center px-2 data-[highlighted]:bg-neutral-200 dark:data-[highlighted]:bg-neutral-600 dark:data-[disabled]:text-neutral-500',
		className
	)}
>
	{@render children?.()}
</li>
