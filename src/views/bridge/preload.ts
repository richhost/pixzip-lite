/**
 * Electrobun preload script — runs in the webview BEFORE any page scripts.
 *
 * Responsibilities:
 *  1. Initialise Electrobun's browser-side RPC and register webview message
 *     handlers that dispatch DOM Custom Events so the Svelte app can subscribe
 *     to them without importing electrobun/view directly.
 *  2. Expose `window.__pixzipRpc` so the Svelte client.ts can call bun functions.
 *  3. Expose `window.pixzip` shim for legacy compatibility (OS platform,
 *     getPathForFile for drag-and-drop).
 */
import { Electroview } from 'electrobun/view';
import type { PixzipRPCType } from '../../shared/types';

// ── Webview message handlers ──────────────────────────────────────────────────
// Each handler dispatches a typed DOM CustomEvent so the Svelte runes can
// subscribe via document.addEventListener without importing electrobun/view.

const rpc = Electroview.defineRPC<PixzipRPCType>({
	handlers: {
		requests: {},
		messages: {
			maximizeApp: () => {
				document.dispatchEvent(new CustomEvent('pixzip:maximizeApp'));
			},
			unmaximizeApp: () => {
				document.dispatchEvent(new CustomEvent('pixzip:unmaximizeApp'));
			},
			scanned: ({ fileInfoList }) => {
				document.dispatchEvent(new CustomEvent('pixzip:scanned', { detail: fileInfoList }));
			},
			completed: (data) => {
				document.dispatchEvent(new CustomEvent('pixzip:completed', { detail: data }));
			},
			failed: (data) => {
				document.dispatchEvent(new CustomEvent('pixzip:failed', { detail: data }));
			}
		}
	}
});

const ev = new Electroview({ rpc });

// ── Global bridge ─────────────────────────────────────────────────────────────

// The Svelte client.ts uses this to call bun RPC functions (request/send).
(window as unknown as Window & { __pixzipRpc: typeof ev.rpc }).__pixzipRpc = ev.rpc;

// Legacy compatibility shim expected by parts of the renderer.
(window as unknown as Window & { pixzip: unknown }).pixzip = {
	/**
	 * Returns the system file path for a dropped File object.
	 * In non-sandboxed WKWebView (macOS/WebKit), `file.path` is a webkit
	 * extension that exposes the full filesystem path of a dropped file.
	 */
	getPathForFile(file: File): string {
		return (file as File & { path?: string }).path ?? '';
	},

	/** Exposes the OS platform string to the renderer without Electron. */
	process: {
		// The platform is injected at build time by electrobun.config.ts define,
		// or falls back to a safe default.
		platform: (globalThis as Record<string, unknown>).__PIXZIP_PLATFORM__ ?? 'darwin'
	}
};
