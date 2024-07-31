<script lang="ts">
	import {
		Trash2,
		ImageMinus,
		Clipboard,
		SquareArrowOutUpRight,
		ArrowRight,
		ArrowDown
	} from 'lucide-svelte';
	import { MenuContent, MenuItem, MenuRoot, MenuSeparator, MenuTrigger } from '../ui/context-menu';
	import { OS } from '~/lib/utils';
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
			<img
				class="max-w-8 max-h-8 shadow"
				src="https://images.unsplash.com/photo-1722195255633-a88675d20722?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8"
				alt=""
			/>
		</div>
		<div class="grow w-20 min-w-0">
			<div class="truncate min-w-0">
				/Users/abiee/OSS/pixzip/Users/abiee/OSS/pixzip/Users/abiee/OSS/pixzip.png
			</div>
			<section class="flex items-start gap-3">
				<div class="flex items-center gap-1 text-[9px]">
					<span class="px-1 py-px bg-neutral-800 text-white rounded-sm font-bold">JPG</span>
					<ArrowRight class="w-3" />
					<span class="px-1 py-px bg-neutral-800 text-white rounded-sm font-bold">WebP </span>
				</div>

				<div class="flex items-center gap-1">
					<span>2.5MB</span>
					<ArrowRight class="w-3" />
					<span>1.2MB</span>
				</div>

				<div class="flex items-center">
					<ArrowDown class="w-3" />20%
				</div>
			</section>
		</div>
	</div>
{/snippet}
