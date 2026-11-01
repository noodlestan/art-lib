import type * as esbuild from 'esbuild';

export type LoadConfigOptions = {
	cacheDir?: string;
	cache?: boolean;
	baseDir?: string;
	externals?: string[];
};

export type CompiledConfig = {
	bundlePath: string;
	metafile?: esbuild.Metafile;
};

export type ConfigCacheInput = {
	path: string;
	hash: string;
};

export type ConfigCacheMeta = {
	version: number;
	compiledAt: string;
	manifest: string;
	inputs: ConfigCacheInput[];
};
