import { client } from '$lib/client';
import { Store } from '@tanstack/svelte-store';

type TaskStore = {
	task: Map<string, FileTask[]>;
};

export const taskStore = new Store<TaskStore>({ task: new Map() });

type RemoveTask = {
	spaceId: string;
	filepath: string;
};
export const removeTask = ({ spaceId, filepath }: RemoveTask) => {
	taskStore.setState((prev) => {
		const taskMap = structuredClone(prev.task);
		const list = taskMap.get(spaceId) ?? [];
		const newList = list.filter((item) => item.filepath !== filepath);
		taskMap.set(spaceId, newList);
		client.removeTask({ spaceId, filepath });

		return {
			task: new Map(taskMap)
		};
	});
};

export const emptyTaskWithSpaceId = (spaceId: string) => {
	client.emptyTask({ spaceId });
	taskStore.setState((prev) => {
		const taskMap = prev.task;
		taskMap.delete(spaceId);
		return { task: new Map(taskMap) };
	});
};
