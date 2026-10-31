import type * as esbuild from 'esbuild';

export interface LoadConfigOptions {
	cacheDir?: string;
	cache?: boolean;
	baseDir?: string;
	externals?: string[];
}

export interface CompiledConfig {
	bundlePath: string;
	metafile?: esbuild.Metafile;
}

export interface ConfigCacheInput {
	path: string;
	hash: string;
}

export interface ConfigCacheMeta {
	version: number;
	compiledAt: string;
	manifest: string;
	inputs: ConfigCacheInput[];
}
