import { client } from '$lib/client';
import { defaultSpaceStore, spaceStore } from '$lib/stores/space';
import { useStore } from '@tanstack/svelte-store';

/** Convert a file:// URI to a decoded filesystem path. */
function uriToPath(uri: string): string {
	try {
		const url = new URL(uri.trim());
		if (url.protocol !== 'file:') return '';
		return decodeURIComponent(url.pathname);
	} catch {
		return '';
	}
}

export class DragFile {
	private spaceId = useStore(defaultSpaceStore);
	private spaces = useStore(spaceStore);

	private space = $derived.by(() => {
		return this.spaces.current.find((element) => element.id === this.spaceId.current);
	});

	ondragover = (e: DragEvent) => {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
	};

	ondrop = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!this.space) return;

		const dt = e.dataTransfer;
		if (!dt) return;

		// 1. Synchronous getData — works in WebKit / WKWebView for files from Finder
		const uriList = dt.getData('text/uri-list');
		if (uriList) {
			const paths = uriList
				.split(/\r?\n/)
				.filter((line) => line && !line.startsWith('#'))
				.map(uriToPath)
				.filter(Boolean);
			if (paths.length > 0) {
				client.scan({ directory: paths });
				return;
			}
		}

		// 2. Fallback: Chromium / Electron — file.path private extension
		const files = dt.files;
		const directory: string[] = [];
		for (let i = 0; i < files.length; i++) {
			const path = (files[i] as File & { path?: string }).path ?? '';
			if (path) directory.push(path);
		}
		if (directory.length > 0) client.scan({ directory });
	};
}
