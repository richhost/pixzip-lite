import type { RPCSchema } from 'electrobun/bun';

// ── Domain types ──────────────────────────────────────────────────────────────

export type PixzipSpace = {
	id: string;
	name: string;
	width?: number;
	height?: number;
	suffix: string;
	format: 'original' | 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif';
	level: number;
	originalOutput: boolean;
	outputDir?: string;
	keepExif: boolean;
};

export type PixzipFileInfo = {
	path: string;
	size: number;
};

export type PixzipProcessingTask = {
	spaceId: string;
	filepath: string;
	status: 'processing';
	outputPath: string;
	fileSize: number;
	extname: string;
	targetExtname: string;
};

export type PixzipCompletedTask = {
	spaceId: string;
	filepath: string;
	status: 'completed';
	outputPath: string;
	fileSize: number;
	outSize: number;
	extname: string;
	targetExtname: string;
};

export type PixzipFailedTask = {
	spaceId: string;
	filepath: string;
	status: 'failed';
	fileSize: number;
	outputPath: string;
	extname: string;
	targetExtname: string;
};

// ── RPC Schema ────────────────────────────────────────────────────────────────

export type PixzipRPCType = {
	/** Functions that execute in the bun main process */
	bun: RPCSchema<{
		requests: {
			getSpaces: {
				params: Record<string, never>;
				response: PixzipSpace[];
			};
			addSpace: {
				params: { space: PixzipSpace };
				response: PixzipSpace[];
			};
			updateSpace: {
				params: { space: PixzipSpace };
				response: PixzipSpace[];
			};
			deleteSpace: {
				params: { id: string };
				response: PixzipSpace[];
			};
			folderPicker: {
				params: Record<string, never>;
				response: string[];
			};
			getVersion: {
				params: Record<string, never>;
				response: string;
			};
			getThumbPort: {
				params: Record<string, never>;
				response: number;
			};
			getPlatform: {
				params: Record<string, never>;
				response: string;
			};
		};
		messages: {
			maximizeApp: Record<string, never>;
			minimizeApp: Record<string, never>;
			unmaximizeApp: Record<string, never>;
			closeApp: Record<string, never>;
			scan: { directory: string[] };
			openFolder: Record<string, never>;
			pushTask: { task: PixzipProcessingTask[] };
			emptyTask: { spaceId: string };
			removeTask: { spaceId: string; filepath: string };
			revealWith: { filepath: string };
			copyFile: { filepath: string };
			trashFile: { filepath: string };
		};
	}>;
	/** Functions / messages that execute in the webview renderer */
	webview: RPCSchema<{
		requests: Record<string, never>;
		messages: {
			maximizeApp: Record<string, never>;
			unmaximizeApp: Record<string, never>;
			scanned: { fileInfoList: PixzipFileInfo[] };
			completed: PixzipCompletedTask;
			failed: PixzipFailedTask;
		};
	}>;
};
