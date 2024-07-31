<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as menu from '@zag-js/menu';
	import { getApi } from './context.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		children?: Snippet;
		class?: string;
	} & menu.ItemProps;

	const { children, class: className, ...rest }: Props = $props();

	const api = getApi();
</script>

<li
	{...api.getItemProps(rest)}
	class={cn(
		'h-7 data-[highlighted]:bg-neutral-100 rounded flex items-center px-2 data-[disabled]:text-neutral-400',
		className
	)}
>
	{@render children?.()}
</li>
