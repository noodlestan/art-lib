import { createRecordFile } from './private/createRecordFile.js';
import { directoryExists } from './private/directoryExists.js';
import { filterFilenamesByKinds } from './private/filterByKinds.js';
import { findRecordFilesInPath } from './private/findRecordFilesInPath.js';
import type { FSRecordFile, FSRecordsConfig } from './types.js';

export async function findRecordFiles(
	recordsConfig: FSRecordsConfig,
	searchPath: string,
	kinds: string | string[] = [],
): Promise<FSRecordFile[]> {
	if (!directoryExists(searchPath)) {
		return [];
	}

	const results = await Promise.all(
		recordsConfig.paths.map(path => findRecordFilesInPath(searchPath, path)),
	);

	const allCandidates = new Set(results.flat());

	const kindFilter = Array.isArray(kinds) ? kinds : [kinds];
	const files = [...allCandidates].sort().map(filename => createRecordFile(searchPath, filename));
	return filterFilenamesByKinds(files, kindFilter);
}
