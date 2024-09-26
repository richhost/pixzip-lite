<script lang="ts">
	import { cn } from '$lib/shared/utils';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		class?: string;
		label?: string;
	}
	const { class: className, label, ...rest }: Props = $props();
</script>

<label class={cn('flex items-center gap-2', className)}>
	<input type="radio" {...rest} class="peer hidden" />
	<div
		class="w-4 border border-neutral-200 dark:border-neutral-100/10 aspect-square rounded-full peer-checked:bg-neutral-900 dark:peer-checked:bg-neutral-200 after:content-[''] after:w-1.5 after:aspect-square after:bg-neutral-50 dark:after:bg-neutral-800 after:rounded-full grid place-items-center"
	></div>

	<span>{label}</span>
</label>
