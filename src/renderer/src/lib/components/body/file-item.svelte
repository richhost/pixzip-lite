<script lang="ts">
	import { Trash2, ImageMinus, Clipboard } from 'lucide-svelte';
	import { MenuContent, MenuItem, MenuRoot, MenuSeparator, MenuTrigger } from '../ui/context-menu';
</script>

<section class="p-1 even:bg-neutral-50"></section>

<MenuRoot>
	<MenuTrigger>
		<div>hello</div>
	</MenuTrigger>
	<MenuContent>
		<MenuItem value="Svelte">Svelte</MenuItem>
		<MenuSeparator />
		<MenuItem value="delete" class="text-red-600">
			<Trash2 class="w-4 h-4 mr-2" />Delete
		</MenuItem>
	</MenuContent>
</MenuRoot>
