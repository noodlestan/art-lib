import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import type { FSRecordsPattern } from '../files/types.js';
import { makeTempDir } from '../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../test/helpers/tempDirs/removeTempDirs.js';

import { createFSRecordsAdapter } from './createFSRecordsAdapter.js';
import type { FSRecordsAdapterOptions } from './types.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

const pattern: FSRecordsPattern = {
	base: '.',
	pattern: '**/*.art',
	ignored: ['node_modules/', '.git/', 'dist/'],
	excluded: [],
	gitignore: true,
};

function makeOptions(dir: string): FSRecordsAdapterOptions {
	return { basePath: dir, patterns: [pattern] };
}

describe('createFSRecordsAdapter', () => {
	it('discovers .art files under basePath, sorted ascending by path', async () => {
		const dir = makeTempDir(tempDirs);
		mkdirSync(join(dir, 'sub'), { recursive: true });
		writeFileSync(join(dir, 'project.art'), '## Project: demo\n');
		writeFileSync(join(dir, 'sub/nested.art'), '## Project: nested\n');

		const adapter = createFSRecordsAdapter(makeOptions(dir));
		const files = await adapter.discoverRecordFiles();

		expect(files.map(file => file.filename)).toEqual([
			join(dir, 'project.art'),
			join(dir, 'sub/nested.art'),
		]);
	});

	it('returns no files for an empty directory rather than throwing', async () => {
		const dir = makeTempDir(tempDirs);

		const adapter = createFSRecordsAdapter(makeOptions(dir));

		await expect(adapter.discoverRecordFiles()).resolves.toEqual([]);
	});

	it('createContentSource returns a working FSContentSource for a discovered file', async () => {
		const dir = makeTempDir(tempDirs);
		writeFileSync(join(dir, 'project.art'), '## Project: demo\n');

		const adapter = createFSRecordsAdapter(makeOptions(dir));
		const [file] = await adapter.discoverRecordFiles();

		if (file === undefined) throw new Error('expected file');

		const source = adapter.createContentSource(file);
		expect(source.type).toBe('fs');
		expect(source.file).toBe(file);
		expect(await source.readContent()).toBe('## Project: demo\n');
	});
});
