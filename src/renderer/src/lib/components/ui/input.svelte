<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '~/lib/utils';

	type Props = {} & HTMLInputAttributes;

	const { class: className, ...rest }: Props = $props();
</script>

<input
	{...rest}
	class={cn(
		'border h-7 px-2 rounded border-neutral-200 w-full focus-within:outline-neutral-400 focus-within:outline-1 disabled:text-neutral-400',
		className
	)}
/>
