<script lang="ts">
	import { useConfig } from '$lib/hooks/use-config.svelte';
	import NumberInput from '../ui/number-input.svelte';
	import Fieldset from './fieldset.svelte';

	const { getFormData, update } = useConfig();

	const width = $derived.by(() => {
		const value = getFormData()?.width;
		return typeof value === 'number' ? value.toString() : '';
	});
	const height = $derived.by(() => {
		const value = getFormData()?.height;
		return typeof value === 'number' ? value.toString() : '';
	});

	const transformValue = (value: number) => {
		if (Object.is(value, Number.NaN)) return undefined;
		return value < 1 ? undefined : value;
	};
</script>

<Fieldset legend="Resize" class="flex flex-col gap-2">
	<NumberInput
		label="Width"
		inputClass=""
		class="w-28"
		value={width}
		placeholder="Auto"
		onValueChange={({ valueAsNumber }) => {
			update('width', transformValue(valueAsNumber));
		}}
	/>
	<NumberInput
		label="Height"
		inputClass=""
		class="w-28"
		value={height}
		placeholder="Auto"
		onValueChange={({ valueAsNumber }) => {
			update('height', transformValue(valueAsNumber));
		}}
	/>
</Fieldset>
