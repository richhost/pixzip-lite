<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';

	const { ...arkProps }: Menu.ContextTriggerProps = $props();
</script>

<Menu.ContextTrigger {...arkProps} />
