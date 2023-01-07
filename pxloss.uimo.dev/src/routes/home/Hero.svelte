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
		<div class="patterns" />
		<section
			class="max-w-7xl mx-auto py-16 px-5 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 place-items-center gap-10 lg:gap-10"
		>
			<div class="lg:col-span-5 flex flex-col items-center lg:items-start">
				<h1 class="text-3xl lg:text-5xl font-bold">像素丢失</h1>
				<h2 class="text-xl lg:text-3xl font-semibold mt-2 lg:mt-4">美观易用的开源图片压缩软件</h2>

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
				<p class="text-xs text-zinc-400 mt-2">版本 v1.0.2，更新日期：2023/01/05</p>
			</div>

			<img
				class="lg:col-span-7 w-full md:w-4/5 lg:w-full drop-shadow-2xl"
				src="/images/intro.webp"
				alt=""
			/>
		</section>
	</div>
</div>

<style>
	.patterns {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 180px;
		background-color: #ffffff;
		opacity: 0.8;
		background-image: radial-gradient(#383ed3 0.55px, transparent 0.55px),
			radial-gradient(#383ed3 0.55px, #ffffff 0.55px);
		background-size: 22px 22px;
		background-position: 0 0, 11px 11px;
		z-index: -1;
	}
	.patterns::after {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 180px;
		content: '';
		opacity: 1;
		background: linear-gradient(to bottom, transparent, #fff);
	}
</style>
