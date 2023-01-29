<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import Nav from './Nav.svelte';

	let show = false;

	function onClick() {
		show = !show;
	}

	const clickOutside = (node: HTMLElement, fn: Function) => {
		const click = (event: MouseEvent) => {
			if (event.target instanceof Element && !node.contains(event.target)) {
				fn();
			}
		};

		document.addEventListener('click', click, true);

		return {
			destroy() {
				document.removeEventListener('click', click, true);
			}
		};
	};
</script>

<div class="min-h-screen flex flex-col">
	<Nav />
	<div class="relative flex-1 flex items-center">
		<section
			class="max-w-7xl mx-auto py-16 px-5 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 place-items-center gap-10 lg:gap-10"
		>
			<div class="lg:col-span-5 flex flex-col items-center lg:items-start">
				<h1 class="text-3xl lg:text-5xl font-bold">像素丢失</h1>
				<h2 class="text-xl lg:text-3xl font-semibold mt-2 lg:mt-10">现代 Web 应用的压图好手</h2>
				<p class="mt-4 font-light text-sm lg:text-base">
					支持 WebP、AVIF 格式输出，在不损失视觉质量的前提下，大幅度减小文件大小
				</p>

				<div
					use:clickOutside={() => {
						show = false;
					}}
					class="inline-block mt-10 relative select-none"
				>
					<div class="inline-flex rounded overflow-hidden">
						<a
							class="px-8 py-2 text-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
							href="https://www.123pan.com/s/072SVv-Dl7cv"
							target="_blank"
							rel="noreferrer">免费下载</a
						>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<span
							on:click={onClick}
							class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white w-6 flex items-center justify-center text-xl cursor-pointer"
							>▾</span
						>
					</div>

					{#if show}
						<a
							in:fly={{ y: -6, duration: 100 }}
							out:fade={{ duration: 100 }}
							class="absolute -bottom-1 right-0 translate-y-full bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white rounded drop-shadow-lg px-5 py-2 text-sm"
							href="https://github.com/9t5c/pixel-loss/tags"
							target="_blank"
							rel="noreferrer">去 GitHub 下载</a
						>
					{/if}
				</div>
				<p class="mt-2 text-sm text-zinc-700">支持 macOS 和 Windows 系统</p>
				<p class="text-xs text-zinc-400 mt-2">版本 v1.1.1，更新日期：2023/01/29</p>
			</div>

			<img
				class="lg:col-span-7 w-full md:w-4/5 lg:w-full drop-shadow-2xl"
				src="/images/intro.webp"
				alt=""
			/>
		</section>
	</div>
</div>
