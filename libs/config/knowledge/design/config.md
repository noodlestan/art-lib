# Design: Config Loading

**Purpose:** Describe the implemented design of `@art-lib/config` — the compile, cache, and import pipeline, its contracts, and the domain layout of `src/`.

The consumer-facing requirements that motivated the package live in the repository-level design record at [`knowledge/design/config.md`](../../../knowledge/design/config.md). This document describes how the package implements them; the package boundaries are unchanged: config location, cache location, and config data shape stay with each consumer CLI.

## Public Surface

`src/index.ts` exports four functions and four types — nothing else re-exports across the domain boundaries:

```ts
loadConfigModule<T>(entryPath: string, options?: LoadConfigOptions): Promise<T>;

compileConfig(entryPath, options): Promise<CompiledConfig>; // esbuild + bundle/meta write; temp-dir fallback
findReusableBundle(cacheDir, baseDir): Promise<string | null>; // version + shape + sha256 verification
importConfigModule<T>(bundlePath): Promise<T>; // dynamic import, default export

LoadConfigOptions { cacheDir?, cache?, baseDir?, externals? }
CompiledConfig, ConfigCacheInput, ConfigCacheMeta
```

## Loading Pipeline

`loadConfigModule` (in `load/`) orchestrates the three domains:

1. **Reuse** — when `cacheDir` is given and `cache !== false`, `findReusableBundle(cacheDir, baseDir)` (`cache/`) reads the version- and shape-guarded metadata and re-hashes every recorded input; it returns the cached bundle path only while all match.
2. **Compile** — on a cache miss, `compileConfig(entryPath, options)` (`compile/`) runs esbuild bundle-at-runtime (`bundle`, `write: false`, `format: 'esm'`, `platform: 'node'`, `metafile: true`), hashes the `metafile.inputs` relative to `baseDir`, and writes the bundle plus metadata to `cacheDir`. Without a `cacheDir`, or when the cache is unwritable, the bundle lands in a temp dir instead — the load never fails because of caching.
3. **Import** — `importConfigModule<T>(bundlePath)` (`module/`) dynamically imports the bundle via `pathToFileURL` and returns its default export, typed as `T`.

## Cache Contract

The package owns only the file names **inside** the caller-supplied cache directory — never the directory itself:

| File                | Role                                                                |
| ------------------- | ------------------------------------------------------------------- |
| `config.bundle.mjs` | the compiled bundle                                                 |
| `config.cache.json` | versioned metadata: `version`, `compiledAt`, `manifest`, `inputs[]` |

- **Version- and shape-guarded** — metadata with a mismatched `version` (`CONFIG_CACHE_VERSION`), an unparseable body, or a wrong shape means rebuild.
- **Content-based invalidation** — every `metafile.inputs` entry is recorded as a sha256 hash relative to `baseDir`; the bundle is reused only while every input still hashes the same. mtime never decides freshness — mtimes reset on checkout, restore, and container bind.
- **Default externals** — Node builtins and `esbuild` are external by package default; `options.externals` only adds consumer-specific entries (for example, `simple-git` in the Art Workspace Cli).
- **Graceful degradation** — an unwritable cache falls back to a temp-dir bundle (prefix `art-lib-config-`) with a warning; the load still succeeds.
- **Bypass refreshes** — `cache: false` skips the reuse check, rebuilds, and rewrites the bundle and metadata, so the next run is warm.

## Domain Layout

```
src/
├── index.ts        # public entry — the 4 functions + 4 types above
├── types.ts        # shared by several domains, stays at root
├── compile/        # compileConfig + externals, input hashing, bundle/meta write
├── load/           # loadConfigModule orchestrator (+ its tests)
├── module/         # importConfigModule: dynamic import of the bundle
├── cache/          # findReusableBundle + metadata read and input-hash verification
└── private/        # cross-domain helpers only: constants, resolveConfigBaseDir, hashConfigInputPaths
```

Placement rule: a helper goes beside the single module that calls it; only helpers used by more than one domain live in `private/`. `private/constants.ts` is the cache-format contract between the compile (write) half and the cache (read) half.

## Sources

- Repository-level design (consumer requirements): [`../../../knowledge/design/config.md`](../../../knowledge/design/config.md)
- Consumer-facing usage: [`../../README.md`](../../README.md)
- Plan: [`../../../_backlog/3-now/plan-add-config/plan.md`](../../../_backlog/3-now/plan-add-config/plan.md)
