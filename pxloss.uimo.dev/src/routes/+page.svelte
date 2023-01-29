<script lang="ts">
	import '../app.css';

	import Hero from './home/Hero.svelte';
	import Intro from './home/Intro.svelte';
	import Example from './home/Example.svelte';
	import OpenSource from './home/OpenSource.svelte';
	import Thanks from './home/Thanks.svelte';
</script>

<svelte:head>
	<title>像素丢失 - 高效压图</title>
	<meta name="author" content="Abiee" />
	<meta name="description" content="现代 Web 应用的压图好手" />
	<meta name="keywords" content="图片压缩,avif,webp,开源,像素丢失" />
	<meta property="og:title" content="像素丢失" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://pxloss.uimo.dev/images/ogp.png" />
	<meta property="og:url" content="https://pxloss.uimo.dev" />
	<meta property="og:description" content="现代 Web 应用的压图好手" />
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:image" content="https://pxloss.uimo.dev/images/ogp.png" />
	<meta property="twitter:title" content="像素丢失" />
	<meta property="twitter:description" content="现代 Web 应用的压图好手" />
</svelte:head>

<div>
	<Hero />
	<Intro />
	<Example />
	<OpenSource />
	<Thanks />
</div>

<footer class="pt-16 pb-8 text-center text-xs text-zinc-400">©️ 2023 像素丢失</footer>
