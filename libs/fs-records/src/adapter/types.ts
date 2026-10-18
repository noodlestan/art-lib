import type { FSContentSource } from '../files/FSContentSource.js';
import type { FSRecordFile, FSRecordsPattern } from '../files/types.js';

export interface FSRecordsAdapterOptions {
	basePath: string;
	patterns: FSRecordsPattern[];
}

// The adapter is discovery + a content-source factory. It is NOT itself an
// ArtContentSource: a content source addresses one URI, the adapter spans a
// search tree.
export interface FSRecordsAdapter {
	readonly options: FSRecordsAdapterOptions;
	discoverRecordFiles(kinds?: string | string[]): Promise<FSRecordFile[]>;
	createContentSource(file: FSRecordFile): FSContentSource;
}
