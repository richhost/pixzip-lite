import sharp, { FormatEnum, Sharp } from 'sharp';
import { extname } from 'node:path';
import { existsSync, statSync } from 'node:fs';
import { outputFile } from 'fs-extra/esm';

import { qualityMap } from './constants';
import { getGifFrameCount } from './helper';
import { getSpacesFromStore } from '../tipc/space';

sharp.cache(false);

export type BoxingTask = ProcessingTask & Pixzip.Space;

/**
 * Get file extension name, it will be lower case and not contain dot
 * @param filename
 * @returns string
 */
export const getExtname = (filename: string) => {
	return extname(filename).replace('.', '').toLocaleLowerCase();
};

const animated = (filename: string) => {
	const ext = getExtname(filename);
	return ['gif', 'webp'].includes(ext);
};

export const getConfig = (workspaceId: string) => {
	const configs = getSpacesFromStore();
	return configs.find((config) => config.id === workspaceId);
};

export const fileExists = (filepath: string) => {
	return existsSync(filepath);
};

const getFormat = (task: BoxingTask) => {
	let format = task.targetExtname as keyof FormatEnum;

	// in Windows, if gif only have 1 frame, will crash
	if (format === 'gif' && process.platform === 'win32') {
		const count = getGifFrameCount(task.filepath);
		if (count === 1) {
			format = 'png';
		}
	}
	return format;
};

const getQuality = (format: keyof FormatEnum, level: number) => {
	let quality = qualityMap[format] ?? 1;
	return Math.floor((11 - level) * 10 * quality);
};

const keepExif = (sharp: Sharp, keepExif: boolean) => {
	return keepExif ? sharp.keepExif() : sharp.withExif({});
};

export const zip = (task: BoxingTask) => {
	const needAnimated = animated(task.filepath);
	const format = getFormat(task);
	const quality = getQuality(format as keyof FormatEnum, task.level);

	const instance = sharp(task.filepath, {
		animated: needAnimated && format !== 'avif'
	})
		.withMetadata()
		.keepIccProfile();

	return keepExif(instance, task.keepExif)
		.resize({
			width: task.width,
			height: task.height
		})
		.toFormat(format, {
			quality,
			mozjpeg: format === 'jpeg' || format === 'jpg' ? true : undefined,
			colors: format === 'gif' ? Number.parseInt(((quality * 256) / 100).toString(), 10) : undefined,
			dither: format === 'gif' ? 0 : undefined
		})
		.toBuffer();
};

export const output = (buffer: Buffer, task: BoxingTask) => {
	const outFilepath = task.outputPath;
	return new Promise<{ size: number; filepath: string }>((resolve, reject) => {
		outputFile(outFilepath, buffer)
			.then(() => {
				const size = statSync(outFilepath).size;
				resolve({
					size,
					filepath: outFilepath
				});
			})
			.catch(() => reject());
	});
};
