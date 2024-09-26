<script lang="ts">
	import { cn } from '$lib/shared/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
		legend?: string;
		class?: string;
	};

	const { children, class: className, legend }: Props = $props();
</script>

<fieldset>
	<legend class="text-xs mb-1 text-neutral-600">{legend}</legend>
	<div class={cn('border border-neutral-200 dark:border-neutral-100/10 rounded-md p-2', className)}>
		{@render children?.()}
	</div>
</fieldset>
