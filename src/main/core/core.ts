import { getRendererHandlers } from '@egoist/tipc/main';
import { getMainWindow } from '../window';
import { Queue } from './queue';
import { BoxingTask, fileExists, getConfig, output, zip } from './utils';

let max = 5;
const taskQueue = new Queue<BoxingTask>();

async function sendCompletedData(data: CompletedTask) {
	const window = await getMainWindow();
	const handlers = getRendererHandlers<RendererHandlers>(window.webContents);
	handlers.completed.send(data);
}

async function sendFailedData(data: FailedTask) {
	const window = await getMainWindow();
	const handlers = getRendererHandlers<RendererHandlers>(window.webContents);
	handlers.failed.send(data);
}

function bootTask() {
	const length = taskQueue.toArray().length;
	const min = Math.min(max, length);
	for (let i = 0; i < min; i++) {
		const task = taskQueue.dequeue();
		if (task) {
			max--;
			if (!fileExists(task.filepath)) {
				sendFailedData({
					...task,
					status: 'failed'
				});
				max++;
				bootTask();
			} else {
				zip(task)
					.then((buffer) => {
						return output(buffer, task);
					})
					.then(({ size, filepath: outputPath }) => {
						sendCompletedData({
							...task,
							status: 'completed',
							outputPath,
							outSize: size
						});
						max++;
						bootTask();
					})
					.catch((e) => {
						console.error('catch', e);
						sendFailedData({
							...task,
							status: 'failed'
						});
						max++;
						bootTask();
					});
			}
		}
	}
}

export function addTask(tasks: ProcessingTask[]) {
	for (const t of tasks) {
		const box = boxing(t);
		box.forEach((item) => taskQueue.enqueue(item));
	}
	bootTask();
}

function boxing(task: ProcessingTask) {
	const config = structuredClone(getConfig(task.spaceId));
	const list: BoxingTask[] = [];

	if (config) {
		list.push({ ...config, ...task });
	}
	return list;
}

export function clearTask(spaceId: string) {
	const copy = taskQueue.toArray();
	const filter = copy.filter((element) => element.spaceId !== spaceId);
	taskQueue.clear();
	if (filter.length) addTask(filter);
}

export function delTask({ spaceId, filepath }: { spaceId: string; filepath: string }) {
	const copy = taskQueue.toArray();
	const filter = copy.filter(
		(element) => element.spaceId !== spaceId && element.filepath !== filepath
	);
	taskQueue.clear();
	if (filter.length) addTask(filter);
}
