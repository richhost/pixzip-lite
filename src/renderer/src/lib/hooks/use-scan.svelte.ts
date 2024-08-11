import { client, handlers } from '$lib/client';
import { getCurrentConfig, getOutputPath, getTargetExtname, taskExists } from '$lib/shared/task';
import { extname } from '$lib/shared/utils';
import { taskStore } from '$lib/stores/task';

export function useScan() {
	const boxing = (fileInfoList: FileInfo[]) => {
		const config = getCurrentConfig();
		if (!config) return;
		const processingTask = eachTask(config, fileInfoList);
		taskStore.setState((prev) => {
			const taskMap = structuredClone(prev.task);
			const list = taskMap.get(config.id) ?? [];
			taskMap.set(config.id, [...list, ...processingTask]);
			return { task: new Map(taskMap) };
		});

		client.pushTask({ task: processingTask });
	};

	const eachTask = (config: Pixzip.Space, fileInfoList: FileInfo[]) => {
		const processingTask: ProcessingTask[] = [];
		for (let i = 0; i < fileInfoList.length; i++) {
			const file = fileInfoList[i];
			const exists = taskExists(file.path, config.id);
			if (exists) continue;

			const outputPath = getOutputPath(file.path, config);
			const target: ProcessingTask = {
				spaceId: config.id,
				filepath: file.path,
				status: 'processing',
				fileSize: file.size,
				outputPath,
				extname: extname(file.path)!,
				targetExtname: getTargetExtname(file.path, config)
			};
			processingTask.push(target);
		}
		return processingTask;
	};

	$effect(() => {
		const unlisten = handlers.scanned.listen((fileInfoList) => {
			boxing(fileInfoList);
		});

		return () => {
			unlisten();
		};
	});
}
