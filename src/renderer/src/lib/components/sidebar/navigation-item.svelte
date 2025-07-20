<script lang="ts">
	import { cn } from '$lib/shared/utils';
	import { useStore } from '@tanstack/svelte-store';
	import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../ui/context-menu';
	import { defaultSpaceStore, updateDefaultSpace } from '$lib/stores/space';
	import { deleteSpace } from './action';

	const { space, length }: { space: Pixzip.Space; length: number } = $props();

	const defaultId = useStore(defaultSpaceStore);

	let isOpen = $state(false);
</script>

<MenuRoot
	onOpenChange={({ open }) => (isOpen = open)}
	onSelect={({ value }) => {
		if (value === 'delete') {
			deleteSpace(space.id);
		}
	}}
>
	<MenuTrigger
		class={cn(
			'h-8 px-2 w-full border border-transparent flex items-center rounded-lg outline-neutral-900/20 dark:outline-neutral-100/50',
			{
				'bg-neutral-900/10 dark:bg-neutral-100/10': defaultId.current === space.id,
				outline: isOpen
			}
		)}
		onclick={() => updateDefaultSpace(space.id)}
	>
		{space.name}
	</MenuTrigger>
	<MenuContent class="w-28 dark:bg-neutral-700 dark:border-neutral-100/10">
		<MenuItem
			value="delete"
			class="data-[disabled]:text-neutral-300 dark:data-[highlighted]:bg-neutral-600 dark:data-[disabled]:text-neutral-500"
			disabled={length === 1}>Delete</MenuItem
		>
	</MenuContent>
</MenuRoot>
