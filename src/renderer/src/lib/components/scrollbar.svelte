<script lang="ts">
	import SimpleBar from 'simplebar';
	import 'simplebar/dist/simplebar.css';

	let { children } = $props<{ children: any }>();

	let scrollWrapper: HTMLDivElement;

	$effect(() => {
		const simpleBar = new SimpleBar(scrollWrapper, {
			autoHide: true
		});

		return () => simpleBar.unMount();
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
