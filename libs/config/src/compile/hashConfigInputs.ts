import { resolve } from 'node:path';

import type { Metafile } from 'esbuild';

import { hashConfigInputPaths } from '../private/hashConfigInputPaths.js';
import type { ConfigCacheInput } from '../types.js';

export async function hashConfigInputs(
	metafile: Metafile,
	baseDir: string,
): Promise<ConfigCacheInput[]> {
	const inputPaths = Object.keys(metafile.inputs).map(inputPath => resolve(inputPath));
	return hashConfigInputPaths(inputPaths, baseDir);
}
