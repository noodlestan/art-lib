import { discoverRecordFiles } from '../discover/discoverRecordFiles.js';
import type { FSContentSource } from '../files/FSContentSource.js';
import { createFSContentSource } from '../files/createFSContentSource.js';
import type { FSRecordFile } from '../files/types.js';

import type { FSRecordsAdapter, FSRecordsAdapterOptions } from './types.js';

export function createFSRecordsAdapter(options: FSRecordsAdapterOptions): FSRecordsAdapter {
	const discover = async (kinds: string | string[] = []): Promise<FSRecordFile[]> =>
		discoverRecordFiles(options.basePath, options.patterns, kinds);

	const createContentSource = (file: FSRecordFile): FSContentSource => createFSContentSource(file);

	return { options, discoverRecordFiles: discover, createContentSource };
}
