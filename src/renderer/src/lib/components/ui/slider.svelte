<script lang="ts">
	import * as slider from '@zag-js/slider';
	import { normalizeProps, useMachine } from '@zag-js/svelte';
	import type { Optional } from '$lib/types';
	import { useId } from '$lib/shared/utils';

	type Props = { class?: string } & Optional<slider.Context, 'id'>;

	const { class: className, ...zagProps }: Props = $props();

	const [snapshot, send] = useMachine(slider.machine({ id: useId() }), {
		context: zagProps
	});
	const api = $derived(slider.connect(snapshot, send, normalizeProps));
</script>

<div {...api.getRootProps()} class={className}>
	<div {...api.getControlProps()} class="flex items-center">
		<div
			{...api.getTrackProps()}
			class="bg-neutral-200 dark:bg-neutral-100/10 h-1 rounded-full grow"
		>
			<div
				{...api.getRangeProps()}
				class="bg-neutral-800 dark:bg-neutral-200 h-1 rounded-full"
			></div>
		</div>
		{#each api.value as _, index}
			<div
				{...api.getThumbProps({ index })}
				class="size-4 flex items-center justify-center rounded-full bg-neutral-50 dark:bg-neutral-200 shadow border border-neutral-800"
			>
				<input {...api.getHiddenInputProps({ index })} />
			</div>
		{/each}
	</div>
</div>
