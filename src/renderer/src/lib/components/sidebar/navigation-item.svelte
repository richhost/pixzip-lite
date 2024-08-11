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
	<MenuTrigger>
		<button
			class={cn('h-8 px-2 w-full border border-transparent flex items-center rounded-lg', {
				'bg-white border-neutral-100 shadow-xs': defaultId.current === space.id,
				outline: isOpen
			})}
			onclick={() => updateDefaultSpace(space.id)}
		>
			{space.name}
		</button>
	</MenuTrigger>
	<MenuContent class="w-20">
		<MenuItem value="delete" disabled={length === 1}>Delete</MenuItem>
	</MenuContent>
</MenuRoot>
