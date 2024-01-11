<script lang="ts">
	import type { Snippet } from 'svelte';
	import SimpleBar from 'simplebar';
	import 'simplebar/dist/simplebar.css';

	const { children, onscroll } = $props<{
		children: Snippet;
		onscroll?: (event: Event) => void;
	}>();

	let scrollWrapper: HTMLDivElement;

	$effect(() => {
		const simpleBar = new SimpleBar(scrollWrapper, {
			autoHide: true
		});
		const scrollEl = simpleBar.getScrollElement();

		if (onscroll && scrollEl) {
			scrollEl.addEventListener('scroll', onscroll);
		}

		return () => {
			simpleBar.unMount();
			if (onscroll) {
				scrollEl?.removeEventListener('scroll', onscroll);
			}
		};
	});
</script>

<div class="scroll-wrapper" bind:this={scrollWrapper}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.scroll-wrapper {
		height: 100%;
		overflow: auto;
	}
</style>
