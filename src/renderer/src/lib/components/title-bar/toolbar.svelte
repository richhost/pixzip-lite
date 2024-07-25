<script lang="ts">
	import { Plus, Play, Eraser } from 'lucide-svelte';
</script>

<div class="flex items-center gap-0.5">
	<button
		class="h-7 w-7 transition hover:bg-neutral-200 grid place-items-center rounded text-neutral-600"
	>
		<Plus class="w-5 h-5" strokeWidth="1.5" />
	</button>

	<button
		class="h-7 w-7 transition hover:bg-neutral-200 grid place-items-center rounded text-neutral-600"
	>
		<Play class="w-4 h-4" strokeWidth="1.5" />
	</button>

	<button
		class="h-7 w-7 transition hover:bg-neutral-200 grid place-items-center rounded text-neutral-600"
	>
		<Eraser class="w-4 h-4" strokeWidth="1.5" />
	</button>
</div>
