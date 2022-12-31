<script lang="ts">
	import Nav from './Nav.svelte';
</script>

<section
	class="max-w-7xl mx-auto px-5 md:px-10 lg:px-20 h-screen flex items-center justify-center gap-0 lg:gap-10 flex-col lg:flex-row min-h-[700px] relative"
>
	<Nav />

	<div class="w-full lg:w-2/5 text-center lg:text-left">
		<h1 class="text-3xl lg:text-5xl font-bold">像素丢失</h1>
		<h2 class="text-xl lg:text-3xl font-semibold mt-2 lg:mt-4">美观易用的开源图片压缩软件</h2>
		<button class="mt-10 rounded border px-8 py-2 text-xl bg-blue-600 text-white">免费下载</button>
		<p class="mt-2 text-sm text-zinc-700">支持 macOS 和 Windows 系统</p>
	</div>

	<img
		class="w-full drop-shadow-2xl lg:w-3/5 mt-10 lg:mt-0 rounded-lg"
		src="/images/intro.webp"
		alt=""
	/>
</section>
