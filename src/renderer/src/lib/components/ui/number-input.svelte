<script lang="ts">
	import * as numberInput from '@zag-js/number-input';
	import { normalizeProps, useMachine } from '@zag-js/svelte';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	import type { Optional } from '$lib/types';
	import { cn, useId } from '$lib/shared/utils';

	type Props = {
		placeholder?: string;
		label?: string;
		inputClass?: string;
		class?: string;
	} & Optional<numberInput.Context, 'id'>;

	const { placeholder, label, class: className, inputClass, ...zagProps }: Props = $props();

	const [snapshot, send] = useMachine(numberInput.machine({ id: useId() }), {
		context: zagProps
	});

	const api = $derived(numberInput.connect(snapshot, send, normalizeProps));
</script>

<div {...api.getRootProps()} class="h-7 flex items-center justify-between">
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label {...api.getLabelProps()} class="shrink-0 font-medium">{label}</label>
	<div
		{...api.getControlProps()}
		class={cn(
			'h-full flex border border-neutral-200 dark:border-neutral-100/10 focus-within:outline-1 focus-within:outline-neutral-400 rounded pl-2 overflow-hidden',
			className
		)}
	>
		<input
			{...api.getInputProps()}
			class={cn('border-none focus-within:outline-0 grow w-full', inputClass)}
			{placeholder}
		/>
		<div class="flex flex-col shrink-0">
			<button
				class="hover:bg-neutral-200 hover:dark:bg-neutral-100/10 active:scale-95 scale-100 transition"
				{...api.getIncrementTriggerProps()}><ChevronUp size="13" /></button
			>
			<button
				class="hover:bg-neutral-200 hover:dark:bg-neutral-100/10 active:scale-95 scale-100 transition"
				{...api.getDecrementTriggerProps()}><ChevronDown size="13" /></button
			>
		</div>
	</div>
</div>
