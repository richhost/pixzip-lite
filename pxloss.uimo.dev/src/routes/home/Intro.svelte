<script lang="ts">
	import H3 from './H3.svelte';
</script>

<section class="bg-stone-50 py-16">
	<div class="max-w-6xl mx-auto px-4 md:px-10 lg:px-20">
		<H3 text="专为现代 Web 应用设计" />
		<div class="h-16" />

		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
			<figure class="border rounded px-5 py-4">
				<h4 class="text-lg mb-4">工作空间</h4>
				<p class="text-zinc-500">
					利用像素丢失的工作空间，您可以在多个配置之间快速切换，摆脱频繁修改配置的烦恼。
				</p>
			</figure>
			<figure class="border rounded px-5 py-4">
				<h4 class="text-lg mb-4">支持多种格式</h4>
				<p class="text-zinc-500">
					除了 Web 应用中最广泛的 JPG、PNG、GIF、WebP 图片格式，像素丢失还提供 AVIF
					格式输出，支持更高效的压缩效率。
				</p>
			</figure>
			<figure class="border rounded px-5 py-4">
				<h4 class="text-lg mb-4">免费开源</h4>
				<p class="text-zinc-500">任何人或企业都可免费使用，源代码全部开放。</p>
			</figure>
			<figure class="border rounded px-5 py-4">
				<h4 class="text-lg mb-4">隐私保护</h4>
				<p class="text-zinc-500">保护您的隐私，所有操作皆在您的电脑上完成，不会上传任何数据。</p>
			</figure>
		</div>
	</div>
</section>
