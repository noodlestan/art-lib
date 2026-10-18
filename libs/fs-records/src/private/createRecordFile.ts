import { relative, resolve } from 'node:path';

import type { FSRecordFile } from '../files/types.js';

export function createRecordFile(basePath: string, filename: string): FSRecordFile {
	const resolvedBasePath = resolve(basePath);
	const resolvedFilename = resolve(filename);

	return {
		filename: resolvedFilename,
		basePath,
		path: relative(resolvedBasePath, resolvedFilename),
	};
}
