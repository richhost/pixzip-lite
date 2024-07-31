<script lang="ts">
	import * as slider from '@zag-js/slider';
	import { normalizeProps, useMachine } from '@zag-js/svelte';
	import { nanoid } from 'nanoid/non-secure';
	import type { Optional } from '$lib/types';

	type Props = { class?: string } & Optional<slider.Context, 'id'>;

	const { class: className, ...rest }: Props = $props();

	const [snapshot, send] = useMachine(slider.machine({ id: nanoid(), ...rest }));
	const api = $derived(slider.connect(snapshot, send, normalizeProps));
</script>

<div {...api.getRootProps()} class={className}>
	<div {...api.getControlProps()} class="flex items-center">
		<div {...api.getTrackProps()} class="bg-neutral-200 h-1 rounded-full grow">
			<div {...api.getRangeProps()} class="bg-neutral-800 h-1 rounded-full"></div>
		</div>
		{#each api.value as _, index}
			<div
				{...api.getThumbProps({ index })}
				class="size-3.5 flex items-center justify-center rounded-full bg-white shadow outline-1.5"
			>
				<input {...api.getHiddenInputProps({ index })} />
			</div>
		{/each}
	</div>
</div>
