/**
 * Task push/remove/clear handlers.
 * Replaces src/main/tipc/task.ts.
 */
import { addTask, clearTask, delTask } from '../core';

export const taskHandlers = {
	pushTask({ task }: { task: ProcessingTask[] }) {
		addTask(task);
	},

	emptyTask({ spaceId }: { spaceId: string }) {
		clearTask(spaceId);
	},

	removeTask({ spaceId, filepath }: { spaceId: string; filepath: string }) {
		delTask({ spaceId, filepath });
	}
};
