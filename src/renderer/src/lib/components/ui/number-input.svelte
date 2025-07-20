<script lang="ts">
	import { NumberInput } from '@ark-ui/svelte/number-input';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import { cn } from '$lib/shared/utils';

	type Props = {
		inputClass?: string;
		label?: string;
	} & NumberInput.RootProps;

	const { class: className, inputClass, label, placeholder, ...zagProps }: Props = $props();
</script>

<NumberInput.Root class="h-7 flex items-center justify-between" {...zagProps}>
	<NumberInput.Label>{label}</NumberInput.Label>

	<NumberInput.Control
		class={cn(
			'h-full flex border border-neutral-200 dark:border-neutral-100/10 focus-within:outline-1 focus-within:outline-neutral-400 rounded pl-2 overflow-hidden',
			className
		)}
	>
		<NumberInput.Input
			class={cn('border-none focus-within:outline-0 grow w-full', inputClass)}
			{placeholder}
		/>

		<div class="flex flex-col shrink-0">
			<NumberInput.IncrementTrigger
				class="hover:bg-neutral-200 hover:dark:bg-neutral-100/10 active:scale-95 scale-100 transition"
			>
				<ChevronUp size="13" />
			</NumberInput.IncrementTrigger>
			<NumberInput.DecrementTrigger
				class="hover:bg-neutral-200 hover:dark:bg-neutral-100/10 active:scale-95 scale-100 transition"
			>
				<ChevronDown size="13" />
			</NumberInput.DecrementTrigger>
		</div>
	</NumberInput.Control>
</NumberInput.Root>
