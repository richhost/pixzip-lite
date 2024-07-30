<script lang="ts">
	import * as menu from '@zag-js/menu';

	import { setApi, getApi } from './context.svelte';

	import type { Optional } from '~/lib/types';
	import type { Snippet } from 'svelte';

	type Props = Optional<menu.Context, 'id'> & { children?: Snippet };

	const { children, ...rest }: Props = $props();

	setApi(rest);

	const api = getApi();
</script>

<!-- <div {...api.getContextTriggerProps()}>
	<div>right click me</div>
</div>
<div use:portal {...api.getPositionerProps()}>
	<ul {...api.getContentProps()}>
		<li {...api.getItemProps({ value: 'edit' })}>Edit</li>
		<li {...api.getItemProps({ value: 'duplicate' })}>Duplicate</li>
		<li {...api.getItemProps({ value: 'delete' })}>Delete</li>
		<li {...api.getItemProps({ value: 'export' })}>Export...</li>
	</ul>
</div> -->

{#if children}
	{@render children()}
{/if}
