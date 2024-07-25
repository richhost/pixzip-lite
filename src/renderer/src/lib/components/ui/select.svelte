<script lang="ts">
	import { Select } from 'bits-ui';
	import { ChevronsUpDown, Check } from 'lucide-svelte';

	type Props = {
		items: { label: string; value: string }[];
		placeholder?: string;
	};

	const { items, placeholder }: Props = $props();
</script>

<Select.Root>
	<Select.Trigger
		class="flex items-center w-full h-7 border border-neutral-200 rounded focus:outline-1 focus:outline-neutral-400"
	>
		<Select.Value {placeholder} class="grow" />
		<ChevronsUpDown size="16" class="shrink-0 mr-1" />
	</Select.Trigger>

	<Select.Content
		class="w-full border bg-white rounded shadow-lg border-neutral-200 p-2"
		sideOffset={8}
	>
		{#each items as item}
			<Select.Item
				value={item.value}
				class="h-7 px-2 flex items-center hover:bg-neutral-100 transition rounded duration-100 data-[highlighted]:bg-neutral-100"
			>
				<span class="grow">{item.label}</span>
				<Select.ItemIndicator>
					<Check size="16" />
				</Select.ItemIndicator>
			</Select.Item>
		{/each}
		<Select.Arrow />
	</Select.Content>
</Select.Root>
