<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { useFetchVersion } from '$lib/runes/fetch-version.svelte';

	const { version, date } = useFetchVersion();
</script>

<section id="home" class="px-5 font-semibold py-10">
	<hgroup class="flex flex-col gap-1 py-10">
		<h1 class="mx-auto text-[clamp(32px,4vw,48px)] text-center leading-none">
			{m.h1()}
		</h1>
		<p class="text-center text-primary">{m.descr()}</p>
	</hgroup>

	<div class="max-w-4xl mx-auto py-6">
		<img src="/screenshot.webp" alt="screenshot" class="aspect-2140/1334" />
	</div>

	<div class="flex mt-10 items-center justify-center gap-5">
		<a
			href="https://github.com/richhost/pixzip-lite/releases"
			target="_blank"
			class="rounded-full py-2 px-4 hover:shadow-lg bg-primary text-white active:bg-muted transition-all"
			>{m.download()}
		</a>
	</div>
	<p class="mt-5 text-xs font-normal text-zinc-500 text-center">{m.os()} macOS & Windows</p>
	<p class="text-xs font-normal text-zinc-500 text-center">
		{m.version()}{version.value}, {m.updated()}{date.value}
	</p>

	<p class="text-center mt-4">
		如果你需要更多功能（按比例缩放、暗色模式等），请使用 <a
			href="https://pixzip.cutelabs.in"
			target="_blank"
			class="underline underline-offset-4">Pro</a
		> 版本
	</p>
</section>
