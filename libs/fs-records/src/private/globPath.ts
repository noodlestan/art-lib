import { glob } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import type { FSRecordsPattern } from '../files/types.js';

import { normalizeExcludes } from './normalizeExcludes.js';
import { normalizePatterns } from './normalizePatterns.js';

export async function globPath(basePath: string, pattern: FSRecordsPattern): Promise<string[]> {
	const baseDir = join(basePath, pattern.base);
	const patterns = normalizePatterns(baseDir, pattern.pattern);
	const exclude = normalizeExcludes(baseDir, [...pattern.ignored, ...pattern.excluded]);

	const globResult = glob(patterns, { exclude });

	const entries: string[] = [];
	for await (const entry of globResult) {
		entries.push(entry);
	}

	return entries.map(entry => resolve(baseDir, entry));
}
