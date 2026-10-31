import { findReusableBundle } from './cache.js';
import { compileConfig } from './compileConfig.js';
import { importConfigModule } from './importConfigModule.js';
import { resolveConfigBaseDir } from './private/resolveConfigBaseDir.js';
import type { LoadConfigOptions } from './types.js';

export async function loadConfigModule<T>(
	entryPath: string,
	options?: LoadConfigOptions,
): Promise<T> {
	const cacheDir = options?.cacheDir;

	if (cacheDir !== undefined && options?.cache !== false) {
		const baseDir = resolveConfigBaseDir(entryPath, options);
		const reusableBundle = await findReusableBundle(cacheDir, baseDir);

		if (reusableBundle !== null) {
			return importConfigModule<T>(reusableBundle);
		}
	}

	const compiled = await compileConfig(entryPath, options);

	return importConfigModule<T>(compiled.bundlePath);
}
