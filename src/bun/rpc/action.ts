/**
 * File system actions: folder picker, reveal in finder, clipboard copy, trash.
 * Replaces src/main/tipc/action.ts.
 */
import { Utils } from 'electrobun/bun';
import { createRequire } from 'node:module';
import { platform, arch } from 'node:os';

const _require = createRequire(import.meta.url);

type ClipboardEx = { writeFilePaths: (paths: string[]) => void };

async function loadClipboardEx(): Promise<ClipboardEx | null> {
	if (platform() === 'linux') return null;
	const platformPath = `${platform()}-${arch()}`;
	try {
		// Attempt to load the pre-compiled NAPI module included in the project.
		const mod = _require(`../../main/helper/${platformPath}/node.napi.node`);
		return mod?.default ?? mod ?? null;
	} catch {
		console.warn('[action] electron-clipboard-ex NAPI module unavailable; copyFile is a no-op.');
		return null;
	}
}

export const actionHandlers = {
	async folderPicker(): Promise<string[]> {
		const paths = await Utils.openFileDialog({
			canChooseFiles: false,
			canChooseDirectory: true,
			allowsMultipleSelection: false
		});
		return paths ?? [];
	},

	revealWith({ filepath }: { filepath: string }) {
		Utils.showItemInFolder(filepath);
	},

	async copyFile({ filepath }: { filepath: string }) {
		const clipboard = await loadClipboardEx();
		clipboard?.writeFilePaths([filepath]);
	},

	trashFile({ filepath }: { filepath: string }) {
		Utils.moveToTrash(filepath);
	},

	getVersion(): string {
		// Bun can import JSON natively
		// biome-ignore lint: JSON import is intentional
		const pkg = _require('../../../package.json');
		return pkg.version as string;
	}
};
