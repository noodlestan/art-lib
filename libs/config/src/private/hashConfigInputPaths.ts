import { createHash } from 'node:crypto';
import { readFile, realpath } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

import type { ConfigCacheInput } from '../types.js';

async function createConfigCacheInput(
	absolutePath: string,
	absoluteBaseDir: string,
): Promise<ConfigCacheInput> {
	const content = await readFile(absolutePath);
	const hash = createHash('sha256').update(content).digest('hex');
	const path = relative(absoluteBaseDir, absolutePath);
	return { path, hash };
}

function compareConfigCacheInputs(first: ConfigCacheInput, second: ConfigCacheInput): number {
	return first.path.localeCompare(second.path);
}

export async function hashConfigInputPaths(
	inputPaths: string[],
	baseDir: string,
): Promise<ConfigCacheInput[]> {
	const absoluteBaseDir = await realpath(resolve(baseDir));
	const inputs = await Promise.all(
		inputPaths.map(inputPath => createConfigCacheInput(resolve(inputPath), absoluteBaseDir)),
	);
	return inputs.sort(compareConfigCacheInputs);
}
