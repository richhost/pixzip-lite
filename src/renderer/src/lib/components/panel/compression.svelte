<script lang="ts">
	import Fieldset from './fieldset.svelte';
	import Slider from '../ui/slider.svelte';
	import Checkbox from '../ui/checkbox.svelte';
	import { getSpaceConfig } from '$lib/runes/space-config.svelte';
	import { Select } from '../ui/select';

	const items = [
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
		return spaceConfig.formData?.format ?? items[0].value;
	});
</script>

<Fieldset legend="Compression">
	<div class="flex items-center justify-between">
		<span class="font-medium">Format</span>
		<Select
			{items}
			value={[format]}
			onValueChange={({ value }) => {
				spaceConfig.update('format', value[0]);
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
			onValueChange={({ value }) => {
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
