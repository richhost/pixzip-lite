<script lang="ts">
	import {
		FolderPen,
		Scaling,
		WandSparkles,
		HardDriveDownload,
		FolderDown,
		Box
	} from 'lucide-svelte';

	import ItemGroupLabel from './item-group-label.svelte';
	import Input from '../ui/input.svelte';
	import NumberInput from '../ui/number-input.svelte';
	import Select from '../ui/select.svelte';
	import SaveInto from './save-into.svelte';
	import Switch from '../ui/switch.svelte';
	import Slider from '../ui/slider.svelte';

	const items = [
		{ value: 'original', label: 'Original' },
		{ value: 'avif', label: 'AVIF' },
		{ value: 'webp', label: 'WebP' },
		{ value: 'jpg', label: 'JPG' },
		{ value: 'png', label: 'PNG' }
	];
</script>

<section
	class="w-[clamp(var(--w-config-min),16vw,var(--w-config-max))] m-2 rounded-2xl border bg-white border-neutral-200/80 shrink-0"
>
	<form class="flex flex-col gap-5 h-full overflow-auto p-3">
		<ItemGroupLabel text="Space Name">
			{#snippet icon()}
				<FolderPen size="15" />
			{/snippet}

			<label>
				<Input placeholder="Space Name" name="name" />
			</label>
		</ItemGroupLabel>

		<ItemGroupLabel text="Resize (px)">
			{#snippet icon()}
				<Scaling size="15" />
			{/snippet}

			<div class="grid grid-cols-2 gap-2">
				<div>
					<div class="mb-1">Width</div>
					<NumberInput placeholder={'auto'} name="width" />
				</div>
				<div>
					<div class="mb-1">Height</div>
					<NumberInput placeholder={'auto'} name="width" />
				</div>
			</div>
		</ItemGroupLabel>

		<ItemGroupLabel text="Output Format">
			{#snippet icon()}
				<WandSparkles size="15" />
			{/snippet}

			<Select {items} placeholder="Select" />
		</ItemGroupLabel>

		<ItemGroupLabel text="Compression Level">
			{#snippet icon()}
				<HardDriveDownload size="15" />
			{/snippet}

			<Slider max={9} min={1} step={1} class="my-2" />

			<div class="flex items-center justify-between text-xs text-neutral-400">
				<span>Best Quality</span>
				<span>Lowest Quality</span>
			</div>
		</ItemGroupLabel>

		<ItemGroupLabel text="Save Into">
			{#snippet icon()}
				<FolderDown size="15" />
			{/snippet}
			<SaveInto />

			<div>
				<div class="mb-1">Add Suffix</div>
				<Input />
				<div class="text-xs mt-1">filename<span class="text-red-500">-min</span>.jpg</div>
			</div>
		</ItemGroupLabel>

		<ItemGroupLabel text="Other">
			{#snippet icon()}
				<Box size="15" />
			{/snippet}
			<div class="flex items-center gap-2">
				<Switch id="keepExif" name="keepExif" />
				<label for="keepExif">Keep EXIF</label>
			</div>
		</ItemGroupLabel>
	</form>
</section>
