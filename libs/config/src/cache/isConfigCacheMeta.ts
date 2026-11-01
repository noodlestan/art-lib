import { CONFIG_CACHE_VERSION } from '../private/constants.js';
import type { ConfigCacheMeta } from '../types.js';

import { isConfigCacheInput } from './isConfigCacheInput.js';

export function isConfigCacheMeta(value: unknown): value is ConfigCacheMeta {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const meta = value as ConfigCacheMeta;

	return (
		meta.version === CONFIG_CACHE_VERSION &&
		typeof meta.compiledAt === 'string' &&
		typeof meta.manifest === 'string' &&
		Array.isArray(meta.inputs) &&
		meta.inputs.every(isConfigCacheInput)
	);
}
