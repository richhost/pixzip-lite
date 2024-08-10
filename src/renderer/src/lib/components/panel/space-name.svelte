<script lang="ts">
	import { useConfig } from '$lib/hooks/use-config.svelte';
	import Input from '../ui/input.svelte';
	import Fieldset from './fieldset.svelte';

	const { getFormData, update } = useConfig();

	const name = $derived(getFormData()?.name);
</script>

<Fieldset legend="Basic">
	<label class="flex items-center justify-between">
		<span>Name</span>
		<Input
			class="w-24"
			value={name}
			onchange={(e) => {
				update('name', (e.target as HTMLInputElement).value);
			}}
		/>
	</label>
</Fieldset>
