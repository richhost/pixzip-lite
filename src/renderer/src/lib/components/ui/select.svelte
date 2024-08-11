<script lang="ts">
	import { cn } from '$lib/shared/utils';
	import { Select, type SelectProps } from 'bits-ui';
	import { ChevronsUpDown, Check } from 'lucide-svelte';

	type Props = {
		class?: string;
		placeholder?: string;
	} & SelectProps<string, boolean>;

	const { items, placeholder, class: className, ...rest }: Props = $props();
</script>

<Select.Root {...rest}>
	<Select.Trigger
		class={cn(
			'flex items-center w-full h-7 border border-neutral-200 rounded focus:outline-1 focus:outline-neutral-400',
			className
		)}
	>
		<Select.Value {placeholder} class="mr-auto px-2" />
		<ChevronsUpDown size="16" class="shrink-0 mr-1" />
	</Select.Trigger>

	<Select.Content
		class="w-full border bg-white rounded shadow-lg border-neutral-200 p-1"
		sideOffset={8}
	>
		{#each items ?? [] as item}
			<Select.Item
				value={item.value}
				class="h-7 px-2 flex text-sm items-center hover:bg-neutral-100 transition rounded duration-100 data-[highlighted]:bg-neutral-100"
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
