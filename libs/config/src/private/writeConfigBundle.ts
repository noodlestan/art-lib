import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { ConfigCacheInput } from '../types.js';

import { createConfigCacheMeta } from './createConfigCacheMeta.js';

const BUNDLE_FILENAME = 'config.bundle.mjs';
const CACHE_FILENAME = 'config.cache.json';
const TEMP_DIR_PREFIX = 'art-lib-config-';

async function writeConfigArtifacts(
	targetDir: string,
	bundleContent: string,
	manifest: string,
	inputs: ConfigCacheInput[],
): Promise<string> {
	await mkdir(targetDir, { recursive: true });
	const bundlePath = join(targetDir, BUNDLE_FILENAME);
	const cacheMeta = createConfigCacheMeta(manifest, inputs);

	await writeFile(bundlePath, bundleContent);
	await writeFile(join(targetDir, CACHE_FILENAME), JSON.stringify(cacheMeta, null, '\t'));
	return bundlePath;
}

export async function writeConfigBundle(
	bundleContent: string,
	manifest: string,
	inputs: ConfigCacheInput[],
	cacheDir?: string,
): Promise<string> {
	if (cacheDir) {
		try {
			return await writeConfigArtifacts(cacheDir, bundleContent, manifest, inputs);
		} catch {
			// Cache write failure degrades to a temp-dir bundle; caching never fails the run.
		}
	}
	const tempDir = await mkdtemp(join(tmpdir(), TEMP_DIR_PREFIX));
	return writeConfigArtifacts(tempDir, bundleContent, manifest, inputs);
}
