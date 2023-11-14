export class Counter {
	count = $state(0);
	double = $derived(this.count * 2);

	increment() {
		this.count += 1;
	}
}

export function createCounter() {
	let count = $state(0);
	let double = $derived(count * 2);

	function increment() {
		count += 1;
	}
	return {
		get count() {
			return count;
		},
		get double() {
			return double;
		},
		increment
	};
}
