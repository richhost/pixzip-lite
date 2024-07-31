<script lang="ts">
	import * as menu from '@zag-js/menu';

	import { setApi } from './context.svelte';

	import type { Optional } from '$lib/types';
	import type { Snippet } from 'svelte';

	type Props = Optional<menu.Context, 'id'> & { children?: Snippet };

	const { children, ...rest }: Props = $props();

	setApi(rest);
</script>

{@render children?.()}
