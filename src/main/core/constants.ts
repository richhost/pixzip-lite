import { type FormatEnum } from 'sharp';

type FormatEnumKeys = keyof FormatEnum;
export const qualityMap: Partial<Record<FormatEnumKeys, number>> = {
	jpg: 0.85,
	jpeg: 0.85,
	png: 1,
	webp: 0.8,
	avif: 0.7
};

export const delimiter = process.platform === 'win32' ? '\\' : '/';
