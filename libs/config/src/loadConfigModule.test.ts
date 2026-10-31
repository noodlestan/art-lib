import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { build } from 'esbuild';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { compileConfig } from './compileConfig.js';
import { importConfigModule } from './importConfigModule.js';
import { loadConfigModule } from './loadConfigModule.js';
import type { ConfigCacheMeta } from './types.js';

vi.mock('esbuild', async importOriginal => {
	const actual = await importOriginal<typeof import('esbuild')>();

	return {
		...actual,
		build: vi.fn(actual.build),
	};
});

const buildMock = vi.mocked(build);

const tempDirs: string[] = [];

beforeEach(() => {
	buildMock.mockClear();
	vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(async () => {
	vi.restoreAllMocks();
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

function writeConsumerPackage(tempDir: string): void {
	const packageDir = join(tempDir, 'node_modules', 'consumer-fixture');
	mkdirSync(packageDir, { recursive: true });
	writeFileSync(
		join(packageDir, 'package.json'),
		'{"name":"consumer-fixture","type":"module","main":"index.mjs"}',
	);
	writeFileSync(join(packageDir, 'index.mjs'), "export default 'from-consumer-node-modules';");
}

function readCacheMeta(cacheDir: string): ConfigCacheMeta {
	const cacheMetaPath = join(cacheDir, 'config.cache.json');
	return JSON.parse(readFileSync(cacheMetaPath, 'utf8')) as ConfigCacheMeta;
}

function sha256(content: string): string {
	return createHash('sha256').update(content).digest('hex');
}

describe('loadConfigModule', () => {
	it('WHEN given a config entry at a caller-supplied path — loads its default export', async () => {
		const tempDir = makeConfigTempDir();
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`export default { root: '.', depth: 2 };`,
		);

		const config = await loadConfigModule<{ root: string; depth: number }>(entryPath);

		expect(config).toEqual({ root: '.', depth: 2 });
	});

	it('WHEN the config entry imports a package — resolves it from the consumer node_modules', async () => {
		const tempDir = makeConfigTempDir();
		writeConsumerPackage(tempDir);
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`import value from 'consumer-fixture';\nexport default { value };`,
		);

		const config = await loadConfigModule<{ value: string }>(entryPath);

		expect(config.value).toBe('from-consumer-node-modules');
	});

	it('WHEN the config entry is missing — propagates the compiler error', async () => {
		const tempDir = makeConfigTempDir();

		const entryPath = join(tempDir, 'missing.config.ts');

		await expect(loadConfigModule(entryPath)).rejects.toThrow(/Could not resolve/);
	});

	it('WHEN no cacheDir is given — compiles to a temp bundle', async () => {
		const tempDir = makeConfigTempDir();
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`export default { origin: 'temp-bundle' };`,
		);

		const compiled = await compileConfig(entryPath);
		const config = await importConfigModule<{ origin: string }>(compiled.bundlePath);

		expect(compiled.bundlePath.startsWith(tmpdir())).toBe(true);
		expect(config.origin).toBe('temp-bundle');
	});

	it('WHEN a cacheDir is given — writes the bundle and cache metadata', async () => {
		const tempDir = makeConfigTempDir();
		const cacheDir = join(tempDir, '.art-config');
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`export default { cached: true };`,
		);

		const config = await loadConfigModule<{ cached: boolean }>(entryPath, {
			cacheDir,
			baseDir: tempDir,
			externals: ['simple-git'],
		});
		const cacheMeta = readCacheMeta(cacheDir);

		expect(config.cached).toBe(true);
		expect(existsSync(join(cacheDir, 'config.bundle.mjs'))).toBe(true);
		expect(cacheMeta.version).toBe(1);
		expect(cacheMeta.manifest).toBe(entryPath);
		expect(cacheMeta.inputs.map(input => input.path)).toEqual(['art.config.ts']);
	});

	it('WHEN the cacheDir cannot be written — degrades to a temp bundle with a warning', async () => {
		const tempDir = makeConfigTempDir();
		const blockerPath = join(tempDir, 'cache-blocker');
		writeFileSync(blockerPath, 'not a directory');
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`export default { degraded: true };`,
		);

		const config = await loadConfigModule<{ degraded: boolean }>(entryPath, {
			cacheDir: blockerPath,
		});

		expect(config.degraded).toBe(true);
		expect(vi.mocked(console.warn)).toHaveBeenCalledWith(expect.stringContaining(blockerPath));
	});

	it('GIVEN a valid cache — a second load reuses the cached bundle without rebuilding', async () => {
		const tempDir = makeConfigTempDir();
		const cacheDir = join(tempDir, '.art-config');
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`export default { origin: 'warm-cache' };`,
		);

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		buildMock.mockClear();
		const config = await loadConfigModule<{ origin: string }>(entryPath, {
			cacheDir,
			baseDir: tempDir,
		});

		expect(buildMock).not.toHaveBeenCalled();
		expect(config.origin).toBe('warm-cache');
	});

	it('GIVEN the config entry changed — a load rebuilds and refreshes the cache', async () => {
		const tempDir = makeConfigTempDir();
		const cacheDir = join(tempDir, '.art-config');
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`export default { origin: 'first-entry' };`,
		);

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		buildMock.mockClear();
		writeFileSync(entryPath, `export default { origin: 'second-entry' };`);

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		expect(buildMock).toHaveBeenCalledTimes(1);
		expect(readCacheMeta(cacheDir).inputs).toEqual([
			{ path: 'art.config.ts', hash: sha256(readFileSync(entryPath, 'utf8')) },
		]);
	});

	it('GIVEN a file imported by the config entry changed — a load rebuilds', async () => {
		const tempDir = makeConfigTempDir();
		const cacheDir = join(tempDir, '.art-config');
		const settingsPath = join(tempDir, 'settings.mjs');
		writeFileSync(settingsPath, "export const level = 'first-level';\n");
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			"import { level } from './settings.mjs';\nexport default { level };",
		);

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		buildMock.mockClear();
		writeFileSync(settingsPath, "export const level = 'second-level';\n");

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		expect(buildMock).toHaveBeenCalledTimes(1);
		expect(readCacheMeta(cacheDir).inputs).toEqual(
			expect.arrayContaining([
				{ path: 'settings.mjs', hash: sha256(readFileSync(settingsPath, 'utf8')) },
			]),
		);
	});

	it('GIVEN the bundle is missing — a load rebuilds', async () => {
		const tempDir = makeConfigTempDir();
		const cacheDir = join(tempDir, '.art-config');
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`export default { origin: 'rebuilt-bundle' };`,
		);

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		buildMock.mockClear();
		rmSync(join(cacheDir, 'config.bundle.mjs'));

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		expect(buildMock).toHaveBeenCalledTimes(1);
		expect(existsSync(join(cacheDir, 'config.bundle.mjs'))).toBe(true);
	});

	it('GIVEN the cache metadata is missing — a load rebuilds', async () => {
		const tempDir = makeConfigTempDir();
		const cacheDir = join(tempDir, '.art-config');
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`export default { origin: 'rebuilt-meta' };`,
		);

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		buildMock.mockClear();
		rmSync(join(cacheDir, 'config.cache.json'));

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		expect(buildMock).toHaveBeenCalledTimes(1);
		expect(existsSync(join(cacheDir, 'config.cache.json'))).toBe(true);
	});

	it('GIVEN the cache metadata is unparseable — a load rebuilds', async () => {
		const tempDir = makeConfigTempDir();
		const cacheDir = join(tempDir, '.art-config');
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`export default { origin: 'rebuilt-unparseable' };`,
		);

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		buildMock.mockClear();
		writeFileSync(join(cacheDir, 'config.cache.json'), '{not-json');

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		expect(buildMock).toHaveBeenCalledTimes(1);
		expect(readCacheMeta(cacheDir).version).toBe(1);
	});

	it('GIVEN the cache metadata version mismatches — a load rebuilds', async () => {
		const tempDir = makeConfigTempDir();
		const cacheDir = join(tempDir, '.art-config');
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`export default { origin: 'rebuilt-version' };`,
		);

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		buildMock.mockClear();
		const mismatchedMeta = JSON.stringify({ ...readCacheMeta(cacheDir), version: 2 });
		writeFileSync(join(cacheDir, 'config.cache.json'), mismatchedMeta);

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		expect(buildMock).toHaveBeenCalledTimes(1);
		expect(readCacheMeta(cacheDir).version).toBe(1);
	});

	it('GIVEN a recorded input is missing — a load rebuilds', async () => {
		const tempDir = makeConfigTempDir();
		const cacheDir = join(tempDir, '.art-config');
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`export default { origin: 'rebuilt-ghost-input' };`,
		);

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		buildMock.mockClear();
		const cacheMeta = readCacheMeta(cacheDir);
		const ghostInput = { path: 'ghost.config.ts', hash: 'deadbeef' };
		const ghostMeta = JSON.stringify({ ...cacheMeta, inputs: [...cacheMeta.inputs, ghostInput] });
		writeFileSync(join(cacheDir, 'config.cache.json'), ghostMeta);

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		expect(buildMock).toHaveBeenCalledTimes(1);
		expect(readCacheMeta(cacheDir).inputs.map(input => input.path)).toEqual(['art.config.ts']);
	});

	it('GIVEN a warm cache — cache false bypasses reuse and rebuilds', async () => {
		const tempDir = makeConfigTempDir();
		const cacheDir = join(tempDir, '.art-config');
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`export default { origin: 'bypassed-rebuild' };`,
		);

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		buildMock.mockClear();
		const config = await loadConfigModule<{ origin: string }>(entryPath, {
			cacheDir,
			baseDir: tempDir,
			cache: false,
		});

		expect(buildMock).toHaveBeenCalledTimes(1);
		expect(config.origin).toBe('bypassed-rebuild');
	});

	it('GIVEN stale cache metadata — cache false refreshes the cache', async () => {
		const tempDir = makeConfigTempDir();
		const cacheDir = join(tempDir, '.art-config');
		const entryPath = writeConfigEntry(
			tempDir,
			'art.config.ts',
			`export default { origin: 'refreshed-cache' };`,
		);

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir });

		buildMock.mockClear();
		const staleMeta = JSON.stringify({
			...readCacheMeta(cacheDir),
			inputs: [{ path: 'art.config.ts', hash: 'deadbeef' }],
		});
		writeFileSync(join(cacheDir, 'config.cache.json'), staleMeta);

		await loadConfigModule(entryPath, { cacheDir, baseDir: tempDir, cache: false });

		expect(buildMock).toHaveBeenCalledTimes(1);
		expect(readCacheMeta(cacheDir).inputs).toEqual([
			{ path: 'art.config.ts', hash: sha256(readFileSync(entryPath, 'utf8')) },
		]);
	});
});
