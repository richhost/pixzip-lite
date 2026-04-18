/**
 * JSON-file-based persistent key-value store.
 * Replaces `conf` which depended on Electron's app.getName().
 */
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { Utils } from 'electrobun/bun';

const APP_NAME = 'PixZip Lite';
const configDir = join(Utils.paths.appData, APP_NAME);
const configFile = join(configDir, 'config.json');

mkdirSync(configDir, { recursive: true });

let cache: Record<string, unknown> = {};

async function load() {
	try {
		const file = Bun.file(configFile);
		if (await file.exists()) {
			cache = await file.json();
		}
	} catch {
		cache = {};
	}
}

async function persist() {
	try {
		await Bun.write(configFile, JSON.stringify(cache, null, 2));
	} catch (e) {
		console.error('[store] Failed to persist config:', e);
	}
}

// Load synchronously on module init (top-level await is valid in Bun modules)
await load();

export const store = {
	get(key: string): unknown {
		return cache[key];
	},
	set(key: string, value: unknown): void {
		cache[key] = value;
		persist();
	}
};
