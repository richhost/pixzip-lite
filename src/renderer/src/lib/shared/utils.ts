import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const OS = window.pixzip.process.platform;

export const delimiter = OS === 'win32' ? '\\' : '/';

// unique string id
export const useId = (() => {
	let id = 0;
	return () => Date.now().toString(36) + id++;
})();

export function dirname(path: string) {
	return path.split(delimiter).slice(0, -1).join(delimiter);
}

export function basename(path: string, ext?: boolean) {
	let base = path.split(delimiter).pop()!;
	if (ext) {
		base = base.replace(/\.[^/.]+$/, '');
	}
	return base;
}

export function extname(path: string) {
	return path.split('.').pop();
}

export function thumbImg(filepath: string) {
	return `thumb:${delimiter}${delimiter}${filepath}`;
}

export function bytesToSize(bytes: number) {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0 Byte';
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

export function savePercentage(current: number, total: number) {
	const percent = ((current - total) / current) * 100;
	return Math.round(percent * 100) / 100;
}
