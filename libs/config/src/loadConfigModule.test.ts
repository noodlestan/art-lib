import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { compileConfig } from './compileConfig.js';
import { importConfigModule } from './importConfigModule.js';
import { loadConfigModule } from './loadConfigModule.js';
import type { ConfigCacheMeta } from './types.js';

const tempDirs: string[] = [];

afterEach(async () => {
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
		const cacheMetaPath = join(cacheDir, 'config.cache.json');
		const cacheMeta = JSON.parse(readFileSync(cacheMetaPath, 'utf8')) as ConfigCacheMeta;

		expect(config.cached).toBe(true);
		expect(existsSync(join(cacheDir, 'config.bundle.mjs'))).toBe(true);
		expect(cacheMeta.version).toBe(1);
		expect(cacheMeta.manifest).toBe(entryPath);
		expect(cacheMeta.inputs.map(input => input.path)).toEqual(['art.config.ts']);
	});

	it('WHEN the cacheDir cannot be written — degrades to a temp bundle', async () => {
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
	});
});
