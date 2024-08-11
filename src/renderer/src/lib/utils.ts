import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const OS = window.pixzip.process.platform;

// unique string id
export const useId = (() => {
	let id = 0;
	return () => Date.now().toString(36) + id++;
})();
