<script lang="ts">
	import { useConfig } from '$lib/hooks/use-config.svelte';
	import type { Selected } from 'bits-ui';
	import Select from '../ui/select.svelte';
	import Fieldset from './fieldset.svelte';
	import Slider from '../ui/slider.svelte';

	const items: Selected<string>[] = [
		{ value: 'original', label: 'Original' },
		{ value: 'avif', label: 'AVIF' },
		{ value: 'webp', label: 'WebP' },
		{ value: 'png', label: 'PNG' },
		{ value: 'jpg', label: 'JPG' }
	];

	const { getFormData, update } = useConfig();
	const format = $derived.by(() => {
		const value = getFormData()?.format ?? items[0].value;
		return items.find((element) => element.value === value)!;
	});

	const level = $derived.by(() => getFormData()?.level ?? 1);

	const keepEXIF = $derived.by(() => !!getFormData()?.keepExif);
</script>

<Fieldset legend="Compression">
	<div class="flex items-center justify-between">
		<span>Format</span>
		<Select
			{items}
			class="w-28"
			selected={format}
			onSelectedChange={(value) => {
				if (value !== undefined && !Array.isArray(value)) {
					update('format', value.value);
				}
			}}
		></Select>
	</div>

	<hr class="border-neutral-200 mt-3 mb-2" />

	<div>
		<div class="flex items-center justify-between mb-2">
			<span>Level</span>
			<span>{level}</span>
		</div>
		<Slider
			value={[level]}
			step={1}
			min={1}
			max={9}
			onValueChangeEnd={({ value }) => {
				update('level', value[0]);
			}}
		/>
		<div class="text-xs flex items-center justify-between mt-2 text-neutral-600">
			<span>Best Quality</span>
			<span>Lowest Quality</span>
		</div>
	</div>

	<hr class="border-neutral-200 my-3" />

	<label class="inline-flex items-center gap-2">
		<input
			type="checkbox"
			checked={keepEXIF}
			onchange={(e) => {
				update('keepExif', (e.target as HTMLInputElement).checked);
			}}
		/>
		<span>Keep EXIF</span>
	</label>
</Fieldset>
