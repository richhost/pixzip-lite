import { defaultSpaceStore, spaceStore } from '$lib/stores/space';
import { taskStore } from '$lib/stores/task';
import { basename, delimiter, dirname, extname } from './utils';

export const getCurrentConfig = () => {
	const spaces = spaceStore.state;
	const defaultId = defaultSpaceStore.state;
	const target = spaces.find((element) => element.id === defaultId);
	return target;
};

export const getTargetExtname = (filepath: string, config: Pixzip.Space) => {
	const ext = extname(filepath)!.toLowerCase();
	if (config.format === 'original') return ext;
	return config.format;
};

export const getOutputPath = (filepath: string, config: Pixzip.Space) => {
	let outputPath = dirname(filepath);
	let base = basename(filepath, true);
	if (!config.originalOutput && config.outputDir) {
		outputPath = config.outputDir;
	}
	const targetExt = getTargetExtname(filepath, config);
	return outputPath + delimiter + base + config.suffix + '.' + targetExt;
};

export const getTaskMap = () => taskStore.state.task;

export const taskExists = (filepath: string, spaceId: string) => {
	const taskMap = getTaskMap();
	const list = taskMap.get(spaceId) ?? [];
	return list.findIndex((element) => element.filepath === filepath) !== -1;
};
