<script lang="ts">
	import * as select from '@zag-js/select';
	import { normalizeProps, portal, useMachine } from '@zag-js/svelte';
	import { useId } from '$lib/shared/utils';
	import type { SelectProps } from './types';
	import { setSelectContext } from './context';
	import { Check, ChevronsUpDown } from 'lucide-svelte';

	const { items, placeholder, ...zagProps }: SelectProps = $props();

	const [snapshot, send] = useMachine(
		select.machine({
			id: useId(),
			collection: select.collection({ items })
		}),
		{
			context: zagProps
		}
	);
	const api = $derived(select.connect(snapshot, send, normalizeProps));

	setSelectContext({
		get api() {
			return api;
		}
	});
</script>

<div {...api.getRootProps()}>
	<div {...api.getControlProps()}>
		<button
			{...api.getTriggerProps()}
			class="flex items-center w-full h-7 border border-neutral-200 dark:border-neutral-100/10 rounded focus:outline-1 focus:outline-neutral-400"
		>
			<span class="mr-auto px-2">{api.valueAsString || placeholder}</span>
			<span {...api.getIndicatorProps()}><ChevronsUpDown size="16" class="shrink-0 mr-1" /></span>
		</button>
	</div>

	<div use:portal {...api.getPositionerProps()}>
		<ul
			{...api.getContentProps()}
			class="w-full border bg-neutral-50 dark:bg-neutral-700 dark:border-neutral-100/10 border-neutral-200 rounded shadow-lg p-1 min-w-32"
		>
			{#each items as item}
				<li
					{...api.getItemProps({ item })}
					class="h-7 px-2 flex text-sm items-center transition rounded duration-100 data-[highlighted]:bg-neutral-200 dark:data-[highlighted]:bg-neutral-600 dark:data-[disabled]:text-neutral-500"
				>
					<span {...api.getItemTextProps({ item })}>{item.label}</span>
					<span {...api.getItemIndicatorProps({ item })} class="ml-auto"><Check size="16" /></span>
				</li>
			{/each}
		</ul>
	</div>
</div>
