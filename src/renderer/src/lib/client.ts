import { createClient, createEventHandlers } from '@egoist/tipc/renderer';
import type { Router } from '../../../main/tipc';

export const client = createClient<Router>({
	ipcInvoke: window.pixzip.ipcRenderer.invoke
});

export const handlers = createEventHandlers<RendererHandlers>({
	on: window.pixzip.ipcRenderer.on,
	send: window.pixzip.ipcRenderer.send
});
