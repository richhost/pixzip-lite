import fs from 'node:fs';
import { imageExtension } from '../constants';
import path, { extname } from 'node:path';

export const scanDirectory = (dir: string) => {
	let results: FileInfo[] = [];

	const stat = fs.statSync(dir);

	if (stat.isFile()) {
		if (isImage(dir)) {
			results.push({
				path: dir,
				size: stat.size
			});
		}
		return results;
	}

	const list = fs.readdirSync(dir);

	list.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat?.isDirectory()) {
			results = results.concat(scanDirectory(filePath));
		} else if (stat?.isFile() && isImage(file)) {
			results.push({
				path: path.resolve(filePath),
				size: stat.size
			});
		}
	});

	return results;
};

export const isImage = (path: string) => {
	return imageExtension.has(extname(path).toLowerCase());
};
