<script lang="ts">
	import { setSpaceConfig } from '$lib/runes/space-config.svelte';
	import Compression from './compression.svelte';
	import Resize from './resize.svelte';
	import SaveInto from './save-into.svelte';
	import SpaceName from './space-name.svelte';

	setSpaceConfig();
</script>

<form onsubmit={(e) => e.preventDefault()} class="flex flex-col gap-5 h-full overflow-auto p-3">
	<SpaceName />
	<Resize />
	<Compression />
	<SaveInto />
</form>
