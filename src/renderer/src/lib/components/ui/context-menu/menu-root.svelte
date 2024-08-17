<script lang="ts">
	import * as menu from '@zag-js/menu';

	import type { MenuProps } from './types';
	import { normalizeProps, useMachine } from '@zag-js/svelte';
	import { useId } from '$lib/shared/utils';
	import { setMenuContext } from './context';

	const { children, ...zagProps }: MenuProps = $props();

	const [snapshot, send] = useMachine(menu.machine({ id: useId() }), { context: zagProps });
	const api = $derived(menu.connect(snapshot, send, normalizeProps));

	setMenuContext({
		get api() {
			return api;
		}
	});
</script>

{@render children?.()}
