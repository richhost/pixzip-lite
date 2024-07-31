import { createEventHandlers } from '@egoist/tipc/renderer';

export const handlers = createEventHandlers<RendererHandlers>({
	on: (channel, callback) => {
		window.pixzip.on(channel, callback);
		return () => {
			window.pixzip.off(channel, callback);
		};
	},
	send: window.pixzip.send
});
