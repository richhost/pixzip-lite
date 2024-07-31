export const DEFAULT_SPACE = 'currentSpaceId';

export const SPACE_TEMPLATE: Omit<Pixzip.Space, 'id'> = {
	name: 'Space',
	width: undefined,
	height: undefined,
	suffix: '-min',
	format: 'original',
	level: 1,
	originalOutput: true,
	outputDir: '',
	keepExif: false
};
