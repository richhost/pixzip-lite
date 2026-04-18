/**
 * Renderer-side bridge to the Bun main process via Electrobun RPC.
 *
 * The bridge preload (src/views/bridge/preload.ts) runs before this code and
 * exposes `window.__pixzipRpc` — the typed Electrobun RPC object.
 *
 * This module maintains the same public API as the old @egoist/tipc client so
 * that existing Svelte components require zero changes.
 */
import type { PixzipRPCType } from '../../../shared/types';

type BunRPC = {
	request: {
		[K in keyof PixzipRPCType['bun']['requests']]: (
			params: PixzipRPCType['bun']['requests'][K] extends { params: infer P }
				? P
				: Record<string, never>
		) => Promise<PixzipRPCType['bun']['requests'][K] extends { response: infer R } ? R : void>;
	};
	send: {
		[K in keyof PixzipRPCType['bun']['messages']]: (
			payload: PixzipRPCType['bun']['messages'][K]
		) => void;
	};
};

// Lazily retrieve the RPC object injected by the preload.
function getRpc(): BunRPC {
	return (window as unknown as Window & { __pixzipRpc: BunRPC }).__pixzipRpc;
}

// ── Request helpers (bun executes these, returns a value) ────────────────────

export const client = {
	getSpaces: () => getRpc().request.getSpaces({}),
	addSpace: (p: { space: Pixzip.Space }) => getRpc().request.addSpace(p),
	updateSpace: (p: { space: Pixzip.Space }) => getRpc().request.updateSpace(p),
	deleteSpace: (p: { id: string }) => getRpc().request.deleteSpace(p),
	folderPicker: () => getRpc().request.folderPicker({}),
	getVersion: () => getRpc().request.getVersion({}),
	getThumbPort: (): Promise<number> => getRpc().request.getThumbPort({}),
	getPlatform: (): Promise<string> => getRpc().request.getPlatform({}),

	// ── Fire-and-forget messages (bun executes, no response) ────────────────
	maximizeApp: () => getRpc().send.maximizeApp({}),
	minimizeApp: () => getRpc().send.minimizeApp({}),
	unmaximizeApp: () => getRpc().send.unmaximizeApp({}),
	closeApp: () => getRpc().send.closeApp({}),
	scan: (p: { directory: string[] }) => getRpc().send.scan(p),
	openFolder: () => getRpc().send.openFolder({}),
	pushTask: (p: { task: ProcessingTask[] }) => getRpc().send.pushTask(p),
	emptyTask: (p: { spaceId: string }) => getRpc().send.emptyTask(p),
	removeTask: (p: { spaceId: string; filepath: string }) => getRpc().send.removeTask(p),
	revealWith: (p: { filepath: string }) => getRpc().send.revealWith(p),
	copyFile: (p: { filepath: string }) => getRpc().send.copyFile(p),
	trashFile: (p: { filepath: string }) => getRpc().send.trashFile(p)
};

// ── Push-message handlers (bun sends these, webview receives via DOM events) ─
//
// The bridge preload converts Electrobun webview messages into DOM CustomEvents.
// These helpers wrap addEventListener / removeEventListener into a `.listen()`
// pattern that matches the old @egoist/tipc `handlers` API.

function makeHandler<T>(eventName: string) {
	return {
		listen(handler: (data: T) => void): () => void {
			const listener = (e: Event) => handler((e as CustomEvent<T>).detail);
			document.addEventListener(eventName, listener);
			return () => document.removeEventListener(eventName, listener);
		}
	};
}

export const handlers = {
	maximizeApp: makeHandler<void>('pixzip:maximizeApp'),
	unmaximizeApp: makeHandler<void>('pixzip:unmaximizeApp'),
	scanned: makeHandler<FileInfo[]>('pixzip:scanned'),
	completed: makeHandler<CompletedTask>('pixzip:completed'),
	failed: makeHandler<FailedTask>('pixzip:failed')
};
