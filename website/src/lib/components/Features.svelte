<script lang="ts">
	import { t } from '$lib/translations';

	const contents = [
		{
			title: $t('home.workspace.index'),
			description: $t('home.workspace.descr')
		},
		{
			title: $t('home.format.index'),
			description: $t('home.format.descr')
		},
		{
			title: $t('home.local.index'),
			description: $t('home.local.descr')
		},
		{
			title: $t('home.free.index'),
			description: $t('home.free.descr')
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
