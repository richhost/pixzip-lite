declare namespace Pixzip {
	type SafeNumber = `${number}` | number;
	type Format = 'original' | 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif';
	type Space = {
		id: string;
		name: string;
		width?: number;
		height?: number;
		suffix: string;
		format: Format;
		level: number;
		originalOutput: boolean;
		outputDir?: string;
		keepExif: boolean;
	};
	type TaskStatus = 'waiting' | 'preprocessing' | 'processing' | 'succeed' | 'failed';
	type Task = { workspaceId: string; filepath: string };
	type SendData =
		| {
				workspaceId: string;
				filepath: string;
				status: Extract<TaskStatus, 'processing'>;
		  }
		| {
				workspaceId: string;
				filepath: string;
				status: Extract<TaskStatus, 'succeed'>;
				outputPath: string;
				fileSize: number;
		  }
		| {
				workspaceId: string;
				filepath: string;
				status: Extract<TaskStatus, 'failed'>;
		  };
}

type RendererHandlers = {
	maximizeApp: () => void;
	unmaximizeApp: () => void;
};
