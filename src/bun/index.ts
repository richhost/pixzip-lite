/**
 * PixZip Lite — Electrobun main process entry point.
 *
 * Replaces:  src/main/index.ts  +  src/main/window.ts  +  src/main/protocol.ts
 * Runtime:   Bun (via Electrobun)
 */
import { BrowserWindow, BrowserView, ApplicationMenu, Updater } from 'electrobun/bun';
import type { PixzipRPCType } from '../shared/types';
import { loadWindowState, saveWindowState } from './window-state';
import { startThumbServer, getThumbPort } from './thumb-server';
import {
	spaceHandlers,
	taskHandlers,
	actionHandlers,
	scanHandlers,
	uiHandlers,
	setScanSender,
	setWindowRef
} from './rpc';
import { setTaskEventSenders } from './core';

// ── Thumbnail server ──────────────────────────────────────────────────────────
startThumbServer();

// ── Application menu ─────────────────────────────────────────────────────────
ApplicationMenu.setApplicationMenu([
	{
		submenu: [
			{ label: 'About PixZip Lite', role: 'about' },
			{ type: 'separator' },
			{ label: 'Quit', role: 'quit' }
		]
	},
	{
		label: 'Edit',
		submenu: [
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
			{ role: 'selectAll' }
		]
	}
]);

// ── Window creation ───────────────────────────────────────────────────────────
const DEV_SERVER_URL = 'http://localhost:5173';

async function getMainViewUrl(): Promise<string> {
	const channel = await Updater.localInfo.channel();
	if (channel === 'dev') {
		try {
			await fetch(DEV_SERVER_URL, { method: 'HEAD' });
			console.log(`[pixzip] HMR: Vite dev server at ${DEV_SERVER_URL}`);
			return DEV_SERVER_URL;
		} catch {
			console.log('[pixzip] Vite dev server not running — using built assets.');
		}
	}
	return 'views://main/index.html';
}

const initialFrame = await loadWindowState();

// Define the typed RPC for this window
const rpc = BrowserView.defineRPC<PixzipRPCType>({
	maxRequestTime: 10_000,
	handlers: {
		requests: {
			getSpaces: () => spaceHandlers.getSpaces(),
			addSpace: (p) => spaceHandlers.addSpace(p),
			updateSpace: (p) => spaceHandlers.updateSpace(p),
			deleteSpace: (p) => spaceHandlers.deleteSpace(p),
			folderPicker: () => actionHandlers.folderPicker(),
			getVersion: () => actionHandlers.getVersion(),
			getThumbPort: () => getThumbPort(),
			getPlatform: () => process.platform
		},
		messages: {
			maximizeApp: () => uiHandlers.maximizeApp(),
			minimizeApp: () => uiHandlers.minimizeApp(),
			unmaximizeApp: () => uiHandlers.unmaximizeApp(),
			closeApp: () => uiHandlers.closeApp(),
			scan: (p) => scanHandlers.scan(p),
			openFolder: () => scanHandlers.openFolder(),
			pushTask: (p) => taskHandlers.pushTask(p),
			emptyTask: (p) => taskHandlers.emptyTask(p),
			removeTask: (p) => taskHandlers.removeTask(p),
			revealWith: (p) => actionHandlers.revealWith(p),
			copyFile: (p) => actionHandlers.copyFile(p),
			trashFile: (p) => actionHandlers.trashFile(p)
		}
	}
});

const win = new BrowserWindow({
	title: 'PixZip Lite',
	frame: {
		x: initialFrame.x,
		y: initialFrame.y,
		width: Math.max(initialFrame.width, 800),
		height: Math.max(initialFrame.height, 400)
	},
	titleBarStyle: 'hiddenInset',
	transparent: false,
	url: await getMainViewUrl(),
	// The bridge preload sets up window.__pixzipRpc and window.pixzip shims
	// so the Svelte app can call bun RPC functions and receive push messages.
	preload: 'views://bridge/preload.js',
	rpc
});

// ── Wire dependencies that need the window reference ─────────────────────────
setWindowRef(win);
setScanSender((fileInfoList) => rpc.send.scanned({ fileInfoList }));

// Send task-completion events to the renderer via webview RPC messages
setTaskEventSenders(
	(data) => rpc.send.completed(data),
	(data) => rpc.send.failed(data)
);

// ── Window state persistence ──────────────────────────────────────────────────
win.on('resize', (e) => {
	const ev = e as { data: { x: number; y: number; width: number; height: number } };
	const { x, y, width, height } = ev.data;
	saveWindowState({ x, y, width, height });
});

win.on('move', (e) => {
	const ev = e as { data: { x: number; y: number } };
	const { x, y } = ev.data;
	const { width, height } = win.getSize();
	saveWindowState({ x, y, width, height });
});

// ── Maximize/unmaximize notifications to renderer ─────────────────────────────
// (Electrobun doesn't fire "maximize" / "unmaximize" events yet on the window,
//  so we poll or rely on the resize event.  We can extend this later.)
