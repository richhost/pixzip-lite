<script lang="ts">
	import { cn } from '$lib/shared/utils';

	const { class: className }: { class?: string } = $props();
</script>

<hr class={cn('-mx-1 text-neutral-100 dark:text-neutral-100/10 my-1', className)} />
