<script lang="ts">
	import * as numberInput from '@zag-js/number-input';
	import { normalizeProps, useMachine } from '@zag-js/svelte';
	import { nanoid } from 'nanoid/non-secure';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	import type { Optional } from '~/lib/types';

	type Props = { placeholder?: string } & Optional<numberInput.Context, 'id'>;

	const { placeholder, ...reset }: Props = $props();

	const [snapshot, send] = useMachine(numberInput.machine({ id: nanoid(), ...reset }));

	const api = $derived(numberInput.connect(snapshot, send, normalizeProps));
</script>

<div {...api.getRootProps()} class="h-7">
	<div
		{...api.getControlProps()}
		class="h-full flex border border-neutral-200 focus-within:outline-1 focus-within:outline-neutral-400 rounded pl-2 overflow-hidden"
	>
		<input
			{...api.getInputProps()}
			class="border-none focus-within:outline-0 grow w-full"
			{placeholder}
		/>
		<div class="flex flex-col shrink-0">
			<button
				class="hover:bg-neutral-200 active:scale-95 scale-100 transition"
				{...api.getDecrementTriggerProps()}><ChevronUp size="14" /></button
			>
			<button
				class="hover:bg-neutral-200 active:scale-95 scale-100 transition"
				{...api.getIncrementTriggerProps()}><ChevronDown size="14" /></button
			>
		</div>
	</div>
</div>
