/**
 * Task queue core — same logic as src/main/core/core.ts but replaces
 * Electron-specific event dispatch with injectable callbacks.
 */
import { Queue } from '../../main/core/queue';
import { fileExists, output, zip, getConfig } from './utils';

export type BoxingTask = ProcessingTask & Pixzip.Space;

let max = 5;
const taskQueue = new Queue<BoxingTask>();

type SendCompleted = (data: CompletedTask) => void;
type SendFailed = (data: FailedTask) => void;

// Injected by the main process once the BrowserWindow is ready
let _sendCompleted: SendCompleted = () => {};
let _sendFailed: SendFailed = () => {};

export function setTaskEventSenders(completed: SendCompleted, failed: SendFailed) {
	_sendCompleted = completed;
	_sendFailed = failed;
}

function bootTask() {
	const length = taskQueue.toArray().length;
	const min = Math.min(max, length);
	for (let i = 0; i < min; i++) {
		const task = taskQueue.dequeue();
		if (task) {
			max--;
			if (!fileExists(task.filepath)) {
				_sendFailed({ ...task, status: 'failed' });
				max++;
				bootTask();
			} else {
				zip(task)
					.then((buffer) => output(buffer, task))
					.then(({ size, filepath: outputPath }) => {
						_sendCompleted({
							...task,
							status: 'completed',
							outputPath,
							outSize: size
						});
						max++;
						bootTask();
					})
					.catch((e) => {
						console.error('[core] task error:', e);
						_sendFailed({ ...task, status: 'failed' });
						max++;
						bootTask();
					});
			}
		}
	}
}

function boxing(task: ProcessingTask): BoxingTask[] {
	const config = getConfig(task.spaceId);
	if (!config) return [];
	return [{ ...config, ...task }];
}

export function addTask(tasks: ProcessingTask[]) {
	for (const t of tasks) {
		boxing(t).forEach((item) => taskQueue.enqueue(item));
	}
	bootTask();
}

export function clearTask(spaceId: string) {
	const remaining = taskQueue.toArray().filter((t) => t.spaceId !== spaceId);
	taskQueue.clear();
	remaining.forEach((t) => taskQueue.enqueue(t));
}

export function delTask({ spaceId, filepath }: { spaceId: string; filepath: string }) {
	const remaining = taskQueue
		.toArray()
		.filter((t) => !(t.spaceId === spaceId && t.filepath === filepath));
	taskQueue.clear();
	remaining.forEach((t) => taskQueue.enqueue(t));
}
