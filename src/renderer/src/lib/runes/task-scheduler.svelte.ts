import { handlers } from '$lib/client';
import { taskStore } from '$lib/stores/task';

export class TaskScheduler {
	constructor() {
		$effect(() => {
			const unlisent1 = handlers.completed.listen((data) => {
				taskStore.setState((prev) => {
					const taskMap = structuredClone(prev.task);
					const list = taskMap.get(data.spaceId) ?? [];
					const index = list.findIndex((element) => element.outputPath === data.outputPath);
					if (index !== -1) list.splice(index, 1, data);
					return {
						task: new Map(taskMap)
					};
				});
			});

			const unlisent2 = handlers.failed.listen((data) => {
				console.error('failed', data);
			});

			return () => {
				unlisent1();
				unlisent2();
			};
		});
	}
}
