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
			class="w-4 aspect-square border rounded border-neutral-200 grid place-items-center peer-checked:bg-neutral-900"
		>
			<Check class="w-3 h-3 text-white" />
		</div>
	</div>
	<span>{label}</span>
</label>
