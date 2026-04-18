/**
 * preBuild hook — executed by Electrobun before assembling the app bundle.
 *
 * Builds the Svelte renderer with Vite so the static HTML/JS/CSS output is
 * available in `dist-renderer/` for the `build.copy` step in electrobun.config.ts.
 */
import { spawnSync } from 'bun';

const result = spawnSync(['bun', 'run', 'vite', 'build', '--config', 'vite.renderer.config.ts'], {
	cwd: process.cwd(),
	stdout: 'inherit',
	stderr: 'inherit'
});

if (result.exitCode !== 0) {
	console.error('[preBuild] Vite renderer build failed');
	process.exit(1);
}

console.log('[preBuild] Vite renderer build complete → dist-renderer/');
