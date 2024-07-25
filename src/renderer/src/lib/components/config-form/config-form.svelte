<script lang="ts">
	import { FolderPen, Scaling, WandSparkles, HardDriveDownload, FolderDown } from 'lucide-svelte';

	import ItemGroupLabel from './item-group-label.svelte';
	import Input from '../ui/input.svelte';
	import NumberInput from '../ui/number-input.svelte';
	import Select from '../ui/select.svelte';

	const items = [
		{ value: 'original', label: 'Original' },
		{ value: 'avif', label: 'AVIF' },
		{ value: 'webp', label: 'WebP' },
		{ value: 'jpg', label: 'JPG' },
		{ value: 'png', label: 'PNG' }
	];
</script>

<section
	class="w-[clamp(var(--w-config-min),16vw,var(--w-config-max))] bg-white m-2 rounded-2xl border border-neutral-200/80 p-3"
>
	<form class="grid grid-cols-1 gap-5">
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

			<input
				type="range"
				step="1"
				min="1"
				max="9"
				class="w-full h-2 bg-neutral-200 border-none rounded-lg appearance-none"
			/>
			<div class="flex items-center justify-between text-xs text-neutral-400">
				<span>Best Quality</span>
				<span>Lowest Quality</span>
			</div>
		</ItemGroupLabel>

		<ItemGroupLabel text="Save Into">
			{#snippet icon()}
				<FolderDown size="15" />
			{/snippet}
			<div></div>
		</ItemGroupLabel>
	</form>
</section>
