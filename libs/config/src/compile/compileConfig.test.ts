import { mkdtempSync, writeFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { build } from 'esbuild';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { compileConfig } from './compileConfig.js';

vi.mock('esbuild', async importOriginal => {
	const actual = await importOriginal<typeof import('esbuild')>();

	return {
		...actual,
		build: vi.fn(actual.build),
	};
});

const buildMock = vi.mocked(build);

const tempDirs: string[] = [];
const outputSpies: unknown[] = [];

beforeEach(() => {
	buildMock.mockClear();
	outputSpies.length = 0;
	outputSpies.push(
		vi.spyOn(console, 'log').mockImplementation(() => {}),
		vi.spyOn(console, 'warn').mockImplementation(() => {}),
		vi.spyOn(console, 'error').mockImplementation(() => {}),
		vi.spyOn(process.stdout, 'write').mockImplementation(() => true),
		vi.spyOn(process.stderr, 'write').mockImplementation(() => true),
	);
});

afterEach(async () => {
	vi.restoreAllMocks();
	outputSpies.length = 0;
	const removedDirs = tempDirs.splice(0);
	await Promise.all(removedDirs.map(tempDir => rm(tempDir, { recursive: true, force: true })));
});

function makeConfigTempDir(): string {
	const tempDir = mkdtempSync(join(tmpdir(), 'art-lib-config-test-'));
	tempDirs.push(tempDir);
	return tempDir;
}

function writeConfigEntry(tempDir: string, entryName: string, entrySource: string): string {
	const entryPath = join(tempDir, entryName);
	writeFileSync(entryPath, entrySource);
	return entryPath;
}

function expectNoConsoleOrStreamOutput(): void {
	for (const spy of outputSpies) {
		expect(spy).not.toHaveBeenCalled();
	}
}

function expectSilentBuildArguments(): void {
	expect(buildMock).toHaveBeenCalledWith(expect.objectContaining({ logLevel: 'silent' }));
}

describe('compileConfig', () => {
	it('WHEN the config entry fails to bundle — it rejects without console or stream output', async () => {
		const tempDir = makeConfigTempDir();
		const entryPath = writeConfigEntry(tempDir, '.art-workspace.mts', 'export default {{{');

		await expect(compileConfig(entryPath)).rejects.toThrow(/Expected identifier/);

		expectNoConsoleOrStreamOutput();
		expectSilentBuildArguments();
	});

	it('WHEN the config entry bundles — it resolves without console or stream output', async () => {
		const tempDir = makeConfigTempDir();
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`export default { root: '.', depth: 2 };`,
		);

		const compiled = await compileConfig(entryPath);

		expect(compiled.bundlePath).toContain('config.bundle.mjs');
		expectNoConsoleOrStreamOutput();
		expectSilentBuildArguments();
	});
});
