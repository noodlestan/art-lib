import { realpath } from 'node:fs/promises';
import { resolve } from 'node:path';

import type { ConfigCacheInput } from '../types.js';

import { hashConfigInputPaths } from './hashConfigInputPaths.js';

export async function tryHashConfigCacheInputs(
	recordedInputs: ConfigCacheInput[],
	baseDir: string,
): Promise<ConfigCacheInput[] | null> {
	try {
		const absoluteBaseDir = await realpath(resolve(baseDir));
		const inputPaths = recordedInputs.map(input => resolve(absoluteBaseDir, input.path));
		return await hashConfigInputPaths(inputPaths, baseDir);
	} catch {
		return null;
	}
}
