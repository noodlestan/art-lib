import { glob } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import type { FSRecordsPath } from '../types.js';

import { normalizeExcludes } from './normalizeExcludes.js';
import { normalizePatterns } from './normalizePatterns.js';

export async function globPath(searchPath: string, path: FSRecordsPath): Promise<string[]> {
	const baseDir = join(searchPath, path.base);
	const pattern = normalizePatterns(baseDir, path.pattern);
	const exclude = normalizeExcludes(baseDir, [...path.ignored, ...path.excluded]);

	const globResult = glob(pattern, { exclude });

	const entries: string[] = [];
	for await (const entry of globResult) {
		entries.push(entry);
	}

	return entries.map(entry => resolve(baseDir, entry));
}
