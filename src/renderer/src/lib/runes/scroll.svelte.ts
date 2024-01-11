import { untrack } from 'svelte';

type Position = { top: number; left: number };
type Target = Element | Document;

export function useScroller() {
	let target = $state<Target>();

	let position = $state<Position>();

	function setTarget(el: Target) {
		target = el;
	}

	$effect(() => {
		target;

		const updatePosition = () => {
			console.log('eeee');
			let newPosition: Position;
			if (target === document) {
				if (document.scrollingElement) {
					newPosition = {
						left: document.scrollingElement.scrollLeft,
						top: document.scrollingElement.scrollTop
					};
				} else {
					newPosition = {
						left: Math.max(
							window.scrollX,
							document.documentElement.scrollLeft,
							document.body.scrollLeft
						),
						top: Math.max(
							window.scrollY,
							document.documentElement.scrollTop,
							document.body.scrollTop
						)
					};
				}
			} else {
				newPosition = {
					left: (target as Element).scrollLeft,
					top: (target as Element).scrollTop
				};
			}
			position = newPosition;
		};

		untrack(() => {
			target?.addEventListener('scroll', updatePosition);
		});

		return () => {
			target?.removeEventListener('scroll', updatePosition);
		};
	});

	return {
		get position() {
			return position;
		},
		setTarget
	};
}
