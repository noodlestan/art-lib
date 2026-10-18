import { writeFile } from 'node:fs/promises';

import type { FSContentSource } from './FSContentSource.js';
import { readRecordFileContent } from './readRecordFileContent.js';
import type { FSRecordFile } from './types.js';

export function createFSContentSource(file: FSRecordFile): FSContentSource {
	let cached: string | undefined;

	const readContent = async (): Promise<string> => {
		if (cached !== undefined) return cached;
		const withContent = await readRecordFileContent(file);
		if (withContent.error !== undefined) throw withContent.error;
		if (withContent.content === undefined) {
			throw new Error(`No content for ${withContent.filename}`);
		}
		cached = withContent.content;
		return cached;
	};

	const writeContent = async (content: string): Promise<void> => {
		await writeFile(file.filename, content, 'utf-8');
		cached = content; // refresh so the next readContent() sees what we wrote
	};

	return {
		type: 'fs',
		file,
		get uri(): string {
			return `file://${file.filename}`;
		},
		get maybeContent(): string | undefined {
			return cached;
		},
		readContent,
		writeContent,
	};
}
