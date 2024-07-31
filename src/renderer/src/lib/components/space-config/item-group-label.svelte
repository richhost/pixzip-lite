<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	type Props = {
		icon: Snippet;
		text: string;
		children?: Snippet;
		class?: string;
	};

	const { icon, text, children, class: className }: Props = $props();
</script>

<fieldset class={cn('flex flex-col gap-2', className)}>
	<div class="flex items-center gap-2 font-semibold">
		<div class="text-neutral-400">{@render icon()}</div>
		<span>{text}</span>
	</div>

	{#if children}
		{@render children()}
	{/if}
</fieldset>
