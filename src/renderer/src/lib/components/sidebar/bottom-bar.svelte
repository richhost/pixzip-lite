<script>
	import { Plus } from 'lucide-svelte';
	import { addSpace } from './action';
</script>

<div class="mb-2 px-2 flex items-center justify-between">
	<button
		type="button"
		class="w-7 h-7 flex items-center justify-center transition hover:bg-neutral-200 rounded active:scale-95"
		onpointerdown={addSpace}
	>
		<Plus class="w-5 h-5" strokeWidth="1.5" />
	</button>
</div>
