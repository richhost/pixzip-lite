<script lang="ts">
	import 'the-new-css-reset';
	import '@radix-ui/colors/sky.css';
	import '@radix-ui/colors/gray.css';
	import '../app.css';
	import Aside from '$lib/components/aside.svelte';
	import WindowClose from '$lib/components/icons/ui/window-close.svelte';
	import WindowMaximize from '$lib/components/icons/ui/window-maximize.svelte';
	import WindowMinimize from '$lib/components/icons/ui/window-minimize.svelte';
	import WindowRestore from '$lib/components/icons/ui/window-restore.svelte';
</script>

<div class="layout">
	<header>
		<WindowRestore size={24} />
		<WindowMaximize size={24} />
		<WindowMinimize size={24} />
		<WindowClose size={24} />
	</header>
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

	svg {
		width: 20px;
		height: 20px;
	}
</style>
