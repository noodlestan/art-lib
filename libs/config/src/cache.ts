import { join } from 'node:path';

import { CONFIG_BUNDLE_FILENAME } from './private/constants.js';
import { hasUnchangedConfigInputs } from './private/hasUnchangedConfigInputs.js';
import { isFilePresent } from './private/isFilePresent.js';
import { readConfigCacheMeta } from './private/readConfigCacheMeta.js';
import { tryHashConfigCacheInputs } from './private/tryHashConfigCacheInputs.js';

export async function findReusableBundle(
	cacheDir: string,
	baseDir: string,
): Promise<string | null> {
	const cacheMeta = await readConfigCacheMeta(cacheDir);

	if (cacheMeta === null) {
		return null;
	}

	const bundlePath = join(cacheDir, CONFIG_BUNDLE_FILENAME);

	if (!(await isFilePresent(bundlePath))) {
		return null;
	}

	const currentInputs = await tryHashConfigCacheInputs(cacheMeta.inputs, baseDir);

	if (currentInputs === null) {
		return null;
	}

	const inputsUnchanged = hasUnchangedConfigInputs(cacheMeta.inputs, currentInputs);

	return inputsUnchanged ? bundlePath : null;
}

export { readConfigCacheMeta } from './private/readConfigCacheMeta.js';
export { isConfigCacheMeta } from './private/isConfigCacheMeta.js';
