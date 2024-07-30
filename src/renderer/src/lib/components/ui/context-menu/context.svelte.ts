import { getContext, setContext } from 'svelte';
import * as menu from '@zag-js/menu';
import { normalizeProps, useMachine } from '@zag-js/svelte';
import type { Optional } from '../../../types';
import { nanoid } from 'nanoid';

export type Props = Optional<menu.Context, 'id'>;

const key = Symbol('menu');

const id = nanoid();

export const setApi = (props: Props) => {
	const [snapshot, send] = useMachine(menu.machine({ id: nanoid(), ...props }));

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
