import { getContext, setContext } from 'svelte';

export function createContext<T>() {
	const key = Symbol();
	const get = () => getContext<T>(key);
	const set = (value: T) => setContext(key, value);
	return [get, set, key] as const;
}
