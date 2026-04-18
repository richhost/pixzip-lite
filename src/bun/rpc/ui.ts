/**
 * UI window control message handlers.
 * Replaces src/main/tipc/ui.ts.
 */
import type { BrowserWindow } from 'electrobun/bun';

let _win: BrowserWindow | null = null;

export function setWindowRef(win: BrowserWindow) {
	_win = win;
}

export const uiHandlers = {
	maximizeApp() {
		_win?.maximize();
	},
	minimizeApp() {
		_win?.minimize();
	},
	unmaximizeApp() {
		_win?.unmaximize();
	},
	closeApp() {
		_win?.close();
	}
};
