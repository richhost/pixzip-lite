import type { Snippet } from 'svelte';

export type Length = `${number}px` | `${number}%` | `${number}rem` | `${number}em`;

export type SplitPaneProps = {
	pos?: Length;
	min?: Length;
	max?: Length;
	a?: Snippet;
	b?: Snippet;
};

export type ConstrainParams = {
	element: HTMLElement;
	size: number;
	min: Length;
	max: Length;
	pos: Length;
};
