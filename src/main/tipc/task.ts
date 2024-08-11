import { tipc } from '@egoist/tipc/main';
import { addTask, clearTask, delTask } from '../core';

const t = tipc.create();

export const pushTask = t.procedure
	.input<{ task: ProcessingTask[] }>()
	.action(async ({ input }) => {
		addTask(input.task);
	});

export const emptyTask = t.procedure.input<{ spaceId: string }>().action(async ({ input }) => {
	clearTask(input.spaceId);
});

export const removeTask = t.procedure
	.input<{ spaceId: string; filepath: string }>()
	.action(async ({ input }) => {
		delTask(input);
	});
