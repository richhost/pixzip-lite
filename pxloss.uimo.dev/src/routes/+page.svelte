<script lang="ts">
	import '../app.css';
	import Hero from './home/Hero.svelte';
	import Intro from './home/Intro.svelte';
	import Example from './home/Example.svelte';
	import OpenSource from './home/OpenSource.svelte';
	import Thanks from './home/Thanks.svelte';
</script>

<svelte:head>
	<title>像素丢失 - 美观易用的开源图片压缩软件</title>
	<meta name="description" content="美观易用的开源图片压缩软件" />
</svelte:head>

<main>
	<Hero />
	<Intro />
	<Example />
	<OpenSource />
	<Thanks />
</main>

<footer class="pt-16 pb-8 text-center text-xs text-zinc-400">©️ 2023 像素丢失</footer>
