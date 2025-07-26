<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';

	const contents = [
		{
			title: m['workspace.index'](),
			description: m['workspace.descr']()
		},
		{
			title: m['format.index'](),
			description: m['format.descr']()
		},
		{
			title: m['local.index'](),
			description: m['local.descr']()
		},
		{
			title: m['free.index'](),
			description: m['free.descr']()
		}
	];
</script>

<section
	id="features"
	class="px-5 max-w-7xl mx-auto mt-20 grid gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
>
	{#each contents as item}
		<article>
			<h3 class="text-xl font-medium">{item.title}</h3>
			<p class="text-zinc-500">
				{item.description}
			</p>
		</article>
	{/each}
</section>
