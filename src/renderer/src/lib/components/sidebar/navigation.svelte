<script>
	import { useStore } from '@tanstack/svelte-store';
	import { spaceStore } from '$lib/stores/space';
	import NavigationItem from './navigation-item.svelte';

	const spaces = useStore(spaceStore);
</script>

<nav class="grow overflow-y-auto px-2 pb-2 pt-0.5 space-y-0.5">
	{#each spaces.current as space}
		<NavigationItem {space} length={spaces.current.length} />
	{/each}
</nav>
