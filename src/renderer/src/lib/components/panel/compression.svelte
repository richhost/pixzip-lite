<script lang="ts">
	import type { Selected } from 'bits-ui';
	import Select from '../ui/select.svelte';
	import Fieldset from './fieldset.svelte';
	import Slider from '../ui/slider.svelte';
	import Checkbox from '../ui/checkbox.svelte';
	import { getSpaceConfig } from '$lib/runes/space-config.svelte';

	const items: Selected<string>[] = [
		{ value: 'original', label: 'Original' },
		{ value: 'avif', label: 'AVIF' },
		{ value: 'webp', label: 'WebP' },
		{ value: 'png', label: 'PNG' },
		{ value: 'jpg', label: 'JPG' }
	];

	const spaceConfig = getSpaceConfig();

	const level = $derived(spaceConfig.formData?.level ?? 1);

	const keepEXIF = $derived(!!spaceConfig.formData?.keepExif);

	const format = $derived.by(() => {
		const value = spaceConfig.formData?.format ?? items[0].value;
		return items.find((element) => element.value === value)!;
	});
</script>

<Fieldset legend="Compression">
	<div class="flex items-center justify-between">
		<span class="font-medium">Format</span>
		<Select
			{items}
			class="w-28"
			selected={format}
			onSelectedChange={(value) => {
				if (value !== undefined && !Array.isArray(value)) {
					spaceConfig.update('format', value.value);
				}
			}}
		></Select>
	</div>

	<hr class="border-neutral-200 mt-3 mb-2" />

	<div>
		<div class="flex items-center justify-between mb-2">
			<span class="font-medium">Level</span>
			<span>{level}</span>
		</div>
		<Slider
			value={[level]}
			step={1}
			min={1}
			max={9}
			onValueChangeEnd={({ value }) => {
				spaceConfig.update('level', value[0]);
			}}
		/>
		<div class="text-xs flex items-center justify-between mt-2 text-neutral-600">
			<span>Best Quality</span>
			<span>Lowest Quality</span>
		</div>
	</div>

	<hr class="border-neutral-200 my-3" />

	<Checkbox
		label="Keep EXIF"
		checked={keepEXIF}
		onchange={(e) => {
			spaceConfig.update('keepExif', (e.target as HTMLInputElement).checked);
		}}
	/>
</Fieldset>
