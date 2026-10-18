import type { FSRecordsPattern } from '../files/types.js';

import { getGitIgnoredSet } from './getGitIgnoredSet.js';
import { globPath } from './globPath.js';

export async function findRecordFilesInPath(
	basePath: string,
	pattern: FSRecordsPattern,
): Promise<string[]> {
	const candidates = await globPath(basePath, pattern);

	if (!pattern.gitignore) {
		return candidates;
	}

	const ignoredSet = getGitIgnoredSet(basePath, candidates);
	return candidates.filter(candidate => !ignoredSet.has(candidate));
}
