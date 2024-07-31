<script lang="ts">
	import { cn } from '~/lib/utils';

	const { class: className }: { class?: string } = $props();
</script>

<hr class={cn('-mx-1 text-neutral-100 my-1', className)} />
