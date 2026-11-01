import { CONFIG_CACHE_VERSION } from '../private/constants.js';
import type { ConfigCacheInput, ConfigCacheMeta } from '../types.js';

export function createConfigCacheMeta(
	manifest: string,
	inputs: ConfigCacheInput[],
): ConfigCacheMeta {
	const compiledAt = new Date().toISOString();
	return {
		version: CONFIG_CACHE_VERSION,
		compiledAt,
		manifest,
		inputs,
	};
}
