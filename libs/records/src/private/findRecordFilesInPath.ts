import type { RecordsPath } from '../types';

import { getGitIgnoredSet } from './getGitIgnoredSet';
import { globPath } from './globPath';

export async function findRecordFilesInPath(
	searchPath: string,
	path: RecordsPath,
): Promise<string[]> {
	const candidates = await globPath(searchPath, path);

	if (!path.gitignore) {
		return candidates;
	}

	const ignoredSet = getGitIgnoredSet(searchPath, candidates);
	return candidates.filter(candidate => !ignoredSet.has(candidate));
}
