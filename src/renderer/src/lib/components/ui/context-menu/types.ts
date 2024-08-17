import * as menu from '@zag-js/menu';
import type { Snippet } from 'svelte';

export interface MenuProps extends Omit<menu.Context, 'id'> {
	children?: Snippet;
}

export interface MenuContext {
	api: ReturnType<typeof menu.connect>;
}
