/**
 * Core image-processing utilities for the Bun process.
 * Identical to src/main/core/utils.ts except getConfig fetches from the bun-native store
 * (no Electron dependency).
 */
import sharp, { type FormatEnum, type Sharp } from 'sharp';
import { extname } from 'node:path';
import { existsSync, statSync } from 'node:fs';
import { outputFile } from 'fs-extra/esm';
import { qualityMap } from '../../main/core/constants';
import { getGifFrameCount } from '../../main/core/helper';
import { getSpacesFromStore } from '../rpc/space';

sharp.cache(false);

export type BoxingTask = ProcessingTask & Pixzip.Space;

export const getExtname = (filename: string) => {
	return extname(filename).replace('.', '').toLocaleLowerCase();
};

export const getConfig = (workspaceId: string) => {
	const configs = getSpacesFromStore();
	return configs.find((config) => config.id === workspaceId);
};

export const fileExists = (filepath: string) => existsSync(filepath);

const animated = (filename: string) => {
	const ext = getExtname(filename);
	return ['gif', 'webp'].includes(ext);
};

const getFormat = (task: BoxingTask) => {
	let format = task.targetExtname as keyof FormatEnum;
	if (format === 'gif' && process.platform === 'win32') {
		const count = getGifFrameCount(task.filepath);
		if (count === 1) format = 'png';
	}
	return format;
};

const getQuality = (format: keyof FormatEnum, level: number) => {
	const quality = qualityMap[format] ?? 1;
	return Math.floor((11 - level) * 10 * quality);
};

const applyExif = (s: Sharp, keep: boolean) => (keep ? s.keepExif() : s.withExif({}));

export const zip = (task: BoxingTask) => {
	const needAnimated = animated(task.filepath);
	const format = getFormat(task);
	const quality = getQuality(format as keyof FormatEnum, task.level);

	const instance = sharp(task.filepath, { animated: needAnimated && format !== 'avif' })
		.withMetadata()
		.keepIccProfile();

	return applyExif(instance, task.keepExif)
		.resize({ width: task.width, height: task.height })
		.toFormat(format, {
			quality,
			mozjpeg: format === 'jpeg' || format === 'jpg' ? true : undefined,
			colors:
				format === 'gif' ? Number.parseInt(((quality * 256) / 100).toString(), 10) : undefined,
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
				resolve({ size, filepath: outFilepath });
			})
			.catch(() => reject());
	});
};
