<script>
	import { Plus } from 'lucide-svelte';
	import { addSpace } from './action';
	import Draw from '../draw/draw.svelte';
</script>

<div class="mb-2 px-2 flex items-center gap-0.5">
	<button
		type="button"
		class="w-7 h-7 flex items-center justify-center transition hover:bg-neutral-900/10 dark:hover:bg-neutral-100/10 rounded active:scale-95"
		onpointerup={addSpace}
	>
		<Plus class="w-5 h-5" strokeWidth="1.5" />
	</button>

	<Draw />
</div>
