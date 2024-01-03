<script lang="ts">
	import Brand from './lib/components/brand.svelte';
	import Header from './lib/components/header.svelte';
</script>

<div id="layout">
	<aside class="aside">
		<Brand />
	</aside>
	<main class="main">
		<Header />
	</main>
</div>

<style>
	#layout {
		height: 100dvh;
		display: flex;
	}

	.aside {
		background-color: var(--gray-3);
		width: clamp(180px, 20%, 240px);
		border-inline-end: 1px solid var(--gray-5);
	}

	.main {
		flex-grow: 1;
	}
</style>
