<script lang="ts">
	import { Check } from 'lucide-svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		class?: string;
		label?: string;
	}

	const { class: className, label, ...rest }: Props = $props();
</script>

<label class="flex items-center gap-2">
	<div>
		<input type="checkbox" class="hidden peer" {...rest} />
		<div
			class="w-4 aspect-square border rounded border-neutral-200 dark:border-neutral-100/10 grid place-items-center peer-checked:bg-neutral-900 dark:peer-checked:bg-neutral-200 dark:bg-neutral-900"
		>
			<Check class="w-3 h-3 text-neutral-50 dark:text-neutral-900" />
		</div>
	</div>
	<span>{label}</span>
</label>
