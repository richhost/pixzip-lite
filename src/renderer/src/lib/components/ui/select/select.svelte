<script lang="ts">
	import { Portal } from '@ark-ui/svelte/portal';
	import { Select, createListCollection } from '@ark-ui/svelte/select';
	import { Check, ChevronDownIcon, ChevronsUpDown } from 'lucide-svelte';

	interface Item {
		label: string;
		value: string;
		disabled?: boolean;
	}

	const {
		items,
		placeholder,
		...zagProps
	}: { items: Item[] } & Omit<Select.RootProps, 'collection'> = $props();

	const collection = createListCollection<Item>({
		items
	});
</script>

<Select.Root {collection} {...zagProps}>
	<Select.Control>
		<Select.Trigger
			class="flex items-center w-full h-7 border border-neutral-200 dark:border-neutral-100/10 rounded focus:outline-1 focus:outline-neutral-400"
		>
			<Select.ValueText class="mr-auto px-2" />
			<Select.Indicator>
				<ChevronDownIcon size="16" class="shrink-0 mr-1" />
			</Select.Indicator>
		</Select.Trigger>
	</Select.Control>

	<Portal>
		<Select.Positioner>
			<Select.Content
				class="w-full border bg-neutral-50 dark:bg-neutral-700 dark:border-neutral-100/10 border-neutral-200 rounded shadow-lg p-1 min-w-32"
			>
				{#each collection.items as item (item.value)}
					<Select.Item
						{item}
						class="h-7 px-2 flex text-sm items-center transition rounded duration-100 data-[highlighted]:bg-neutral-200 dark:data-[highlighted]:bg-neutral-600 dark:data-[disabled]:text-neutral-500"
					>
						<Select.ItemText>{item.label}</Select.ItemText>
						<Select.ItemIndicator class="ml-auto"><Check size="16" /></Select.ItemIndicator>
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Positioner>
	</Portal>
</Select.Root>
