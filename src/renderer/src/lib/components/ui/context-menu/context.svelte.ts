import { getContext, setContext } from 'svelte';
import * as menu from '@zag-js/menu';
import { normalizeProps, useMachine } from '@zag-js/svelte';

import { useId } from '$lib/shared/utils';
import { Optional } from '$lib/types';

export type Props = Optional<menu.Context, 'id'>;

const key = Symbol('menu');

export const setApi = (props: Props) => {
	const [snapshot, send] = useMachine(menu.machine({ id: useId() }), {
		context: props
	});

	const _api = $derived(menu.connect(snapshot, send, normalizeProps));

	const api = new Proxy(_api, {
		get: (_, key: keyof typeof _api) => {
			return _api[key];
		}
	});

	setContext(key, api);
};

export const getApi = () => {
	return getContext(key) as menu.Api;
};
