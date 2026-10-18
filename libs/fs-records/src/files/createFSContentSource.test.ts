import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { makeTempDir } from '../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../test/helpers/tempDirs/removeTempDirs.js';

import { createFSContentSource } from './createFSContentSource.js';
import type { FSRecordFile } from './types.js';

const tempDirs: string[] = [];

afterEach(async () => {
	await removeTempDirs(tempDirs);
});

function makeFile(dir: string, name: string): FSRecordFile {
	return { filename: join(dir, name), basePath: dir, path: name };
}

describe('createFSContentSource', () => {
	it('exposes type fs and a file:// uri before any read', () => {
		const dir = makeTempDir(tempDirs);
		const file = makeFile(dir, 'project.art');
		writeFileSync(file.filename, '## Project: demo\n');

		const source = createFSContentSource(file);

		expect(source.type).toBe('fs');
		expect(source.uri).toBe(`file://${file.filename}`);
	});

	it('leaves maybeContent undefined until read, then caches', async () => {
		const dir = makeTempDir(tempDirs);
		const file = makeFile(dir, 'project.art');
		writeFileSync(file.filename, '## Project: demo\n');

		const source = createFSContentSource(file);
		expect(source.maybeContent).toBeUndefined();

		const first = await source.readContent();
		expect(first).toBe('## Project: demo\n');
		expect(source.maybeContent).toBe(first);

		writeFileSync(file.filename, '## Project: changed\n');
		const second = await source.readContent();
		expect(second).toBe(first);
	});

	it('re-reads from disk on a fresh source for the same file', async () => {
		const dir = makeTempDir(tempDirs);
		const file = makeFile(dir, 'project.art');
		writeFileSync(file.filename, '## Project: v1\n');

		const first = createFSContentSource(file);
		await first.readContent();

		writeFileSync(file.filename, '## Project: v2\n');

		const second = createFSContentSource(file);
		expect(await second.readContent()).toBe('## Project: v2\n');
	});

	it('writeContent persists and refreshes the cache', async () => {
		const dir = makeTempDir(tempDirs);
		const file = makeFile(dir, 'project.art');
		writeFileSync(file.filename, '## Project: old\n');

		const source = createFSContentSource(file);
		await source.readContent();
		await source.writeContent('## Project: new\n');

		expect(readFileSync(file.filename, 'utf-8')).toBe('## Project: new\n');
		expect(source.maybeContent).toBe('## Project: new\n');
		expect(await source.readContent()).toBe('## Project: new\n');
	});

	it('readContent throws for a missing file', async () => {
		const dir = makeTempDir(tempDirs);
		const file = makeFile(dir, 'missing.art');

		await expect(createFSContentSource(file).readContent()).rejects.toThrow();
	});
});
