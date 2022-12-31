<script lang="ts">
	import H3 from './H3.svelte';
</script>

<section class="bg-stone-50 py-16">
	<div class="max-w-6xl mx-auto px-4 md:px-10 lg:px-20">
		<H3 text="管理图片大小的好帮手" />
		<div class="h-16" />

		<div class="grid grid-cols-1 xl:grid-cols-4 gap-4">
			<figure class="border rounded px-5 py-4">
				<h4 class="text-lg mb-4">压缩到指定尺寸</h4>
				<p class="text-zinc-500">在压缩的同时，指定目标图片的宽、高</p>
			</figure>
			<figure class="border rounded px-5 py-4">
				<h4 class="text-lg mb-4">支持多种格式</h4>
				<p class="text-zinc-500">支持 JPG/PNG/WebP/AVIF 等多种格式输出</p>
			</figure>
			<figure class="border rounded px-5 py-4">
				<h4 class="text-lg mb-4">免费开源</h4>
				<p class="text-zinc-500">免费使用，源代码开放</p>
			</figure>
			<figure class="border rounded px-5 py-4">
				<h4 class="text-lg mb-4">隐私保护</h4>
				<p class="text-zinc-500">所有操作皆在本地完成，不会上传任何数据</p>
			</figure>
		</div>
	</div>
</section>
