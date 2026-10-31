import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { ConfigCacheInput } from '../types.js';

import { CONFIG_BUNDLE_FILENAME, CONFIG_CACHE_FILENAME, TEMP_DIR_PREFIX } from './constants.js';
import { createConfigCacheMeta } from './createConfigCacheMeta.js';

async function writeConfigArtifacts(
	targetDir: string,
	bundleContent: string,
	manifest: string,
	inputs: ConfigCacheInput[],
): Promise<string> {
	await mkdir(targetDir, { recursive: true });
	const bundlePath = join(targetDir, CONFIG_BUNDLE_FILENAME);
	const cacheMeta = createConfigCacheMeta(manifest, inputs);

	await writeFile(bundlePath, bundleContent);
	await writeFile(join(targetDir, CONFIG_CACHE_FILENAME), JSON.stringify(cacheMeta, null, '\t'));
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
			console.warn(
				`@art-lib/config: failed to write the config cache at ${cacheDir}; falling back to a temp bundle.`,
			);
		}
	}
	const tempDir = await mkdtemp(join(tmpdir(), TEMP_DIR_PREFIX));
	return writeConfigArtifacts(tempDir, bundleContent, manifest, inputs);
}
