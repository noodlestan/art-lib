import type { FSRecordFile, FSRecordsPattern } from '../files/types.js';
import { createRecordFile } from '../private/createRecordFile.js';
import { directoryExists } from '../private/directoryExists.js';
import { filterFilenamesByKinds } from '../private/filterByKinds.js';
import { findRecordFilesInPath } from '../private/findRecordFilesInPath.js';

export async function discoverRecordFiles(
	basePath: string,
	patterns: FSRecordsPattern[],
	kinds: string | string[] = [],
): Promise<FSRecordFile[]> {
	if (!directoryExists(basePath)) {
		return [];
	}

	const results = await Promise.all(
		patterns.map(pattern => findRecordFilesInPath(basePath, pattern)),
	);

	const allCandidates = new Set(results.flat());

	const kindFilter = Array.isArray(kinds) ? kinds : [kinds];
	const files = [...allCandidates].sort().map(filename => createRecordFile(basePath, filename));
	return filterFilenamesByKinds(files, kindFilter);
}
