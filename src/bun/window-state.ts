/**
 * Persists and restores window frame (position + size).
 * Replaces `electron-window-state`.
 */
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { Utils } from 'electrobun/bun';

const APP_NAME = 'PixZip Lite';
const stateDir = join(Utils.paths.appData, APP_NAME);
const stateFile = join(stateDir, 'window-state.json');

mkdirSync(stateDir, { recursive: true });

type WindowState = { x: number; y: number; width: number; height: number };

const DEFAULT_STATE: WindowState = { x: 0, y: 0, width: 800, height: 500 };

async function load(): Promise<WindowState> {
	try {
		const file = Bun.file(stateFile);
		if (await file.exists()) {
			const saved = await file.json();
			return { ...DEFAULT_STATE, ...saved };
		}
	} catch {
		// fall through to defaults
	}
	return { ...DEFAULT_STATE };
}

async function save(state: WindowState) {
	try {
		await Bun.write(stateFile, JSON.stringify(state, null, 2));
	} catch (e) {
		console.error('[window-state] Failed to save:', e);
	}
}

export async function loadWindowState() {
	return load();
}

export async function saveWindowState(state: WindowState) {
	return save(state);
}
