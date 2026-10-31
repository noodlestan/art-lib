import { createHash } from 'node:crypto';
import { readFile, realpath } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

import type { Metafile } from 'esbuild';

import type { ConfigCacheInput } from '../types.js';

async function createConfigCacheInput(
	inputPath: string,
	baseDir: string,
): Promise<ConfigCacheInput> {
	const absolutePath = resolve(inputPath);
	const content = await readFile(absolutePath);
	const hash = createHash('sha256').update(content).digest('hex');
	const path = relative(baseDir, absolutePath);
	return { path, hash };
}

function compareConfigCacheInputs(first: ConfigCacheInput, second: ConfigCacheInput): number {
	return first.path.localeCompare(second.path);
}

export async function hashConfigInputs(
	metafile: Metafile,
	baseDir: string,
): Promise<ConfigCacheInput[]> {
	const absoluteBaseDir = await realpath(resolve(baseDir));
	const inputPaths = Object.keys(metafile.inputs);
	const inputs = await Promise.all(
		inputPaths.map(inputPath => createConfigCacheInput(inputPath, absoluteBaseDir)),
	);
	return inputs.sort(compareConfigCacheInputs);
}
