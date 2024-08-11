import fs from 'fs';
import { imageExtension } from '../constants';
import path, { extname } from 'path';

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

		if (stat && stat.isDirectory()) {
			// 递归到子目录
			results = results.concat(scanDirectory(filePath));
		} else if (stat && stat.isFile() && isImage(file)) {
			// 将图片文件信息添加到结果中
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
