<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';

	import { t } from '$lib/translations';
	import Navbar from '$lib/components/Navbar.svelte';
	import Home from '$lib/components/Home.svelte';
	import Features from '$lib/components/Features.svelte';
	import Showcase from '$lib/components/Showcase.svelte';
</script>

<MetaTags
	title={$t('meta.title')}
	description={$t('meta.description')}
	keywords={[
		'pixzip',
		'avif',
		'webp',
		'开源图片压缩软件',
		'open source image compression software',
		'图片压缩软件',
		'image compression software',
		'图片压缩',
		'image compression',
		'图片压缩工具',
		'image compression tool',
		'像素丢失'
	]}
/>

<Navbar />

<main>
	<Home />
	<Features />
	<Showcase />
</main>

<footer class="py-10 text-xs text-center text-zinc-500">2025 ©️ CuteLabs</footer>
