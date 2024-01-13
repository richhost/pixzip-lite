<script lang="ts">
	import Scrollbar from '../Scrollbar.svelte';
</script>

<section class="container">
	<header class="header draggable">toolbar</header>

	<Scrollbar>
		<div></div>
	</Scrollbar>
</section>

<style>
	.container {
		display: flex;
		flex-direction: column;
		border-inline-end: 1px solid var(--gray-5);
		background-color: var(--gray-2);
		height: 100dvh;
	}

	.header {
		height: var(--h-header);
	}
</style>
