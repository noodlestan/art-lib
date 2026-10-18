import type { ArtContentSource } from '@art-md/primitives';

import type { FSRecordFile } from './types.js';

// One per file. Implements the chain's ArtContentSource contract: content
// acquisition and persistence only — no parsing, no record semantics.
export interface FSContentSource extends ArtContentSource {
	readonly type: 'fs';
	readonly file: FSRecordFile;
}
