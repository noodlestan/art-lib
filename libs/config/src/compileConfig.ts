import { dirname, resolve } from 'node:path';

import { type BuildOptions, build } from 'esbuild';

import { getConfigExternals } from './private/getConfigExternals.js';
import { hashConfigInputs } from './private/hashConfigInputs.js';
import { writeConfigBundle } from './private/writeConfigBundle.js';
import type { CompiledConfig, LoadConfigOptions } from './types.js';

export async function compileConfig(
	entryPath: string,
	options?: LoadConfigOptions,
): Promise<CompiledConfig> {
	const externals = getConfigExternals(options?.externals);
	const buildOptions = {
		entryPoints: [entryPath],
		bundle: true,
		write: false,
		format: 'esm',
		platform: 'node',
		metafile: true,
		external: externals,
	} satisfies BuildOptions;
	const buildResult = await build(buildOptions);

	const metafile = buildResult.metafile;
	const bundleOutput = buildResult.outputFiles[0];
	if (!bundleOutput) {
		throw new Error(`Config entry compiled without a bundle: ${entryPath}`);
	}

	const baseDir = options?.baseDir ?? dirname(resolve(entryPath));
	const inputs = await hashConfigInputs(metafile, baseDir);
	const manifest = resolve(entryPath);
	const bundlePath = await writeConfigBundle(
		bundleOutput.text,
		manifest,
		inputs,
		options?.cacheDir,
	);
	return { bundlePath, metafile };
}
