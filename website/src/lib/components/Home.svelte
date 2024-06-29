<script lang="ts">
	import { t } from '$lib/translations';
	import { useFetchVersion } from '$lib/runes/fetch-version.svelte';

	const { version, date } = useFetchVersion();
</script>

<section id="home" class="px-5 font-semibold py-10">
	<div class="max-w-4xl mx-auto py-6">
		<img src="/1.webp" alt="screenshot" class="aspect-[2000/1481]" />
	</div>

	<hgroup class="flex flex-col-reverse gap-1">
		<h1 class="mx-auto text-[clamp(32px,4vw,48px)] text-center leading-10">
			{$t('home.h1')}
		</h1>
		<p class="text-center text-primary mb-2">{$t('home.descr')}</p>
	</hgroup>

	<div class="flex mt-10 items-center justify-center gap-5">
		<a
			href="https://github.com/richhost/pixzip/releases"
			target="_blank"
			class="rounded-full py-2 px-4 hover:shadow-lg bg-primary text-white active:bg-muted transition-all"
			>{$t('home.download')}
		</a>
	</div>
	<p class="mt-5 text-xs font-normal text-zinc-500 text-center">{$t('home.os')} macOS & Windows</p>
	<p class="text-xs font-normal text-zinc-500 text-center">
		{$t('home.version')}{version.value}, {$t('home.updated')}{date.value}
	</p>

	<p class="text-center mt-4">
		如果你需要更多功能（按比例缩放、暗色模式等），请使用 <a
			href="https://pixzip.cutepuppy.tech"
			target="_blank"
			class="underline underline-offset-4">Pro</a
		> 版本
	</p>
</section>
