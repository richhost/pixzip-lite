<script lang="ts">
	import { getSpaceConfig } from '$lib/runes/space-config.svelte';
	import Input from '../ui/input.svelte';
	import Fieldset from './fieldset.svelte';

	const spaceConfig = getSpaceConfig();

	const name = $derived(spaceConfig.formData?.name);
</script>

<Fieldset legend="Basic">
	<label class="flex items-center justify-between">
		<span class="font-medium">Name</span>
		<Input
			class="w-28"
			value={name}
			oninput={(e) => {
				spaceConfig.update('name', (e.target as HTMLInputElement).value);
			}}
			spellcheck={false}
		/>
	</label>
</Fieldset>
