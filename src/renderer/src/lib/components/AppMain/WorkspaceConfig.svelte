<script lang="ts">
	import Scrollbar from '../Scrollbar.svelte';
</script>

<section class="container">
	<header class="header draggable">toolbar</header>

	<Scrollbar>
		<div class="content"></div>
	</Scrollbar>
</section>

<style>
	.container {
		display: flex;
		flex-direction: column;
		border-inline-end: 1px solid var(--gray-5);
		background-color: var(--gray-2);
		height: 100%;
		overflow-y: auto;
	}

	.header {
		height: var(--h-header);
	}

	.content {
		height: 200vh;
		background-color: aqua;
	}
</style>
