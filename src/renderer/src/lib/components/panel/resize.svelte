<script lang="ts">
	import { getSpaceConfig } from '$lib/runes/space-config.svelte';
	import NumberInput from '../ui/number-input.svelte';
	import Fieldset from './fieldset.svelte';

	const spaceConfig = getSpaceConfig();

	const width = $derived.by(() => {
		const value = spaceConfig.formData?.width;
		return typeof value === 'number' ? value.toString() : '';
	});
	const height = $derived.by(() => {
		const value = spaceConfig.formData?.height;
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
			spaceConfig.update('width', transformValue(valueAsNumber));
		}}
	/>
	<NumberInput
		label="Height"
		inputClass=""
		class="w-28"
		value={height}
		placeholder="Auto"
		onValueChange={({ valueAsNumber }) => {
			spaceConfig.update('height', transformValue(valueAsNumber));
		}}
	/>
</Fieldset>
