<script lang="ts">
	import 'the-new-css-reset';
	import '@radix-ui/colors/sky.css';
	import '@radix-ui/colors/gray.css';
	import '../app.css';
	import Aside from '$lib/components/aside.svelte';
</script>

<div class="layout">
	<Aside />
	<main class="main">
		<slot />
	</main>
</div>

<style>
	.layout {
		height: 100vh;
		overflow: hidden;
		background: var(--sky-1);
	}

	.main {
		margin: 20px;
		border-radius: 8px;
		background: #fff;
		border: 1px solid var(--gray-3);
	}
</style>
