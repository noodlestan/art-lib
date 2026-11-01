import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { CONFIG_CACHE_FILENAME } from '../private/constants.js';
import type { ConfigCacheMeta } from '../types.js';

import { isConfigCacheMeta } from './isConfigCacheMeta.js';

export async function readConfigCacheMeta(cacheDir: string): Promise<ConfigCacheMeta | null> {
	const metaPath = join(cacheDir, CONFIG_CACHE_FILENAME);
	let content: string;

	try {
		content = await readFile(metaPath, 'utf8');
	} catch {
		return null;
	}

	let parsed: unknown;

	try {
		parsed = JSON.parse(content);
	} catch {
		return null;
	}

	if (!isConfigCacheMeta(parsed)) {
		return null;
	}

	return parsed;
}
