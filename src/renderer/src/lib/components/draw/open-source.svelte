<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';

	const links = [
		{
			name: 'Svelte',
			url: 'https://github.com/sveltejs/svelte'
		},
		{
			name: 'zag',
			url: 'https://github.com/chakra-ui/zag'
		},
		{
			name: 'sharp',
			url: 'https://github.com/lovell/sharp'
		},
		{
			name: 'tipc',
			url: 'https://github.com/egoist/tipc'
		}
	];
</script>

<div class="p-4 dark:bg-neutral-700 dark:text-neutral-100 rounded-md shadow">
	<h2 class="text-lg font-bold mb-1">Open Source</h2>
	<p class="">
		PixZip's development is based on excellent open-source projects. Special thanks to the following
		projects
	</p>
	<ul class="list-disc px-4 mt-2">
		{#each links as item}
			<li>
				<div class="flex items-center gap-0.5">
					<a href={item.url} target="_blank" rel="noreferrer">{item.name}</a>
					<ArrowUpRight class="w-4 h-4 mt-0.5" strokeWidth="1.5" />
				</div>
			</li>
		{/each}
	</ul>
</div>
