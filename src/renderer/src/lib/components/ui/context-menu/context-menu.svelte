<script lang="ts">
	import { ContextMenu } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { flyAndScale } from '~/lib/transition';

	type Props = {
		trigger: Snippet;
		children?: Snippet;
	} & ContextMenu.Props;

	const { trigger, children, ...rest }: Props = $props();
</script>

<ContextMenu.Root {...rest}>
	<ContextMenu.Trigger>
		{@render trigger()}
	</ContextMenu.Trigger>
	<ContextMenu.Content
		transition={flyAndScale}
		class="z-50 bg-white border border-neutral-100 rounded shadow-md max-w-[200px] w-full p-1"
	>
		{#if children}
			{@render children()}
		{/if}
	</ContextMenu.Content>
</ContextMenu.Root>
