import type { ConfigCacheInput, ConfigCacheMeta } from '../types.js';

const CONFIG_CACHE_VERSION = 1;

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
