import { compileConfig } from './compileConfig.js';
import { importConfigModule } from './importConfigModule.js';
import type { LoadConfigOptions } from './types.js';

export async function loadConfigModule<T>(
	entryPath: string,
	options?: LoadConfigOptions,
): Promise<T> {
	const compiled = await compileConfig(entryPath, options);
	return importConfigModule<T>(compiled.bundlePath);
}
