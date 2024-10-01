<script lang="ts">
	import { setSpaceConfig } from '$lib/runes/space-config.svelte';
	import Compression from './compression.svelte';
	import Resize from './resize.svelte';
	import SaveInto from './save-into.svelte';
	import SpaceName from './space-name.svelte';

	setSpaceConfig();
</script>

<h2 class="draggable h-[var(--h-title-bar)] shrink-0 px-3 font-semibold flex items-center gap-2">
	Configuration
</h2>

<form onsubmit={(e) => e.preventDefault()} class="flex flex-col gap-5 grow overflow-auto p-3">
	<SpaceName />
	<Resize />
	<Compression />
	<SaveInto />
</form>
