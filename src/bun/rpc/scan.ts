/**
 * File/directory scan handlers.
 * Replaces src/main/tipc/scan.ts.
 */
import { Utils } from 'electrobun/bun';
import { scanDirectory } from '../../main/helper/scan-img';
import { getImageExtensions } from '../../main/constants';

type ScannedSender = (fileInfoList: FileInfo[]) => void;
let _sendScanned: ScannedSender | null = null;

export function setScanSender(sender: ScannedSender) {
	_sendScanned = sender;
}

function handleScan(directories: string[]) {
	let result: FileInfo[] = [];
	for (const dir of directories) {
		result = result.concat(scanDirectory(dir));
	}
	// Push scanned results to renderer via injected sender callback
	_sendScanned?.(result);
}

export const scanHandlers = {
	scan({ directory }: { directory: string[] }) {
		handleScan(directory);
	},

	async openFolder() {
		const extensions = getImageExtensions();
		const paths = await Utils.openFileDialog({
			canChooseFiles: true,
			canChooseDirectory: true,
			allowsMultipleSelection: true,
			allowedFileTypes: extensions.join(',')
		});
		if (paths && paths.length > 0) {
			handleScan(paths);
		}
	}
};
