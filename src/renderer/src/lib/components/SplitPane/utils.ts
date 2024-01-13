import type { ConstrainParams, Length } from './types';

export function constrain({ element, size, min, max, pos }: ConstrainParams) {
	let min_px = normalize(min, element, size);
	let max_px = normalize(max, element, size);
	let pos_px = normalize(pos, element, size);

	if (min_px < 0) min_px += size;
	if (max_px < 0) max_px += size;

	pos_px = Math.max(min_px, Math.min(max_px, pos_px));

	const position: Length = pos.endsWith('%')
		? size
			? `${(100 * pos_px) / size}%`
			: '0%'
		: `${pos_px}px`;

	console.log('calc', position);

	return position;
}

function normalize(length: Length, element: HTMLElement, size: number) {
	const num = parseFloat(length);

	if (length.endsWith('px')) {
		return num;
	}

	if (length.endsWith('%')) {
		return (size * num) / 100;
	}

	if (length.endsWith('rem')) {
		return num * parseFloat(getComputedStyle(document.documentElement).fontSize);
	}

	if (length.endsWith('em')) {
		return num * parseFloat(getComputedStyle(element).fontSize);
	}

	throw new Error(`Invalid length: ${length}`);
}
