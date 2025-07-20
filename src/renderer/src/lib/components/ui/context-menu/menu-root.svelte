<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';

	const { ...arkProps }: Menu.RootProps = $props();
</script>

<Menu.Root {...arkProps} />
