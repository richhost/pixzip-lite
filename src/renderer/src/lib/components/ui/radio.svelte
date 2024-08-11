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
		class="w-4 border border-neutral-200 aspect-square rounded-full peer-checked:bg-neutral-900 after:content-[''] after:w-1.5 after:aspect-square after:bg-white after:rounded-full grid place-items-center"
	></div>

	<span>{label}</span>
</label>
