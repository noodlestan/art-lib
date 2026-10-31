import { dirname, resolve } from 'node:path';

import type { LoadConfigOptions } from '../types.js';

export function resolveConfigBaseDir(entryPath: string, options?: LoadConfigOptions): string {
	return options?.baseDir ?? dirname(resolve(entryPath));
}
