<script lang="ts">
	import {
		Trash2,
		ImageMinus,
		Clipboard,
		SquareArrowOutUpRight,
		ArrowRight,
		ArrowDown,
		Loader,
		ArrowUp
	} from 'lucide-svelte';
	import { MenuContent, MenuItem, MenuRoot, MenuSeparator, MenuTrigger } from '../ui/context-menu';
	import { bytesToSize, OS, savePercentage, thumbImg } from '$lib/shared/utils';

	type Props = {
		file: FileTask;
	};

	const { file }: Props = $props();

	const extDict: Record<string, string> = {
		jpg: 'JPG',
		jpeg: 'JPEG',
		png: 'PNG',
		webp: 'WebP',
		avif: 'AVIF',
		bmp: 'BMP',
		gif: 'GIF'
	};

	const percent = $derived.by(() => {
		if (file.status === 'completed') {
			return savePercentage(file.fileSize, file.outSize);
		}
	});
</script>

<section class="p-1 even:bg-neutral-50">
	<MenuRoot>
		<MenuTrigger>
			{@render image()}
		</MenuTrigger>
		<MenuContent>
			<MenuItem value="show">
				<SquareArrowOutUpRight class="w-4 h-4 mr-2 text-neutral-500" />Show in Folder
			</MenuItem>
			{#if OS !== 'linux'}
				<MenuItem value="copy">
					<Clipboard class="w-4 h-4 mr-2 text-neutral-500" />Copy
				</MenuItem>
			{/if}
			<MenuItem value="remove">
				<ImageMinus class="w-4 h-4 mr-2 text-neutral-500" />Remove
			</MenuItem>
			<MenuSeparator />
			<MenuItem value="delete" class="text-red-600">
				<Trash2 class="w-4 h-4 mr-2" />Delete
			</MenuItem>
		</MenuContent>
	</MenuRoot>
</section>

{#snippet image()}
	<div class="flex items-center gap-2 text-xs">
		<div class="w-8 h-8 shrink-0 grid place-items-center">
			<img class="max-w-8 max-h-8 shadow" src={thumbImg(file.filepath)} alt="" />
		</div>
		<div class="grow w-20 min-w-0">
			<div class="truncate min-w-0">
				{file.filepath}
			</div>
			<section class="flex items-center gap-3">
				<div class="flex items-center gap-1">
					<small class="px-1 bg-neutral-800 text-white rounded font-bold"
						>{extDict[file.extname.toLowerCase()]}</small
					>
					<ArrowRight class="w-3" />
					<small class="px-1 bg-neutral-800 text-white rounded font-bold"
						>{extDict[file.targetExtname.toLowerCase()]}</small
					>
				</div>

				{#if file.status === 'completed'}
					<div class="flex items-center gap-1">
						<span>{bytesToSize(file.fileSize)}</span>
						<ArrowRight class="w-3 h-3" />
						<span>{bytesToSize(file.outSize)}</span>
					</div>

					<div class="flex items-center">
						{#if percent !== undefined && percent > 0}
							<ArrowDown class="w-3 h-3" />
						{:else if percent !== undefined && percent < 0}
							<ArrowUp class="w-3 h-3" />
						{/if}
						<small>{percent && Math.abs(percent)}%</small>
					</div>
				{:else if file.status === 'processing'}
					<Loader class="w-3 h-3 animate-spin" />
				{/if}
			</section>
		</div>
	</div>
{/snippet}
