# Overview: Art Lib Config

**Purpose:** Introduce the config package: what it is, its definitions, its use cases, and how a load works.

## What

`@art-lib/config` exposes `loadConfigModule<T>(entryPath, options?)`: esbuild bundle-at-runtime compilation of a caller-supplied TypeScript config entry, an optional content-hash cache in a caller-supplied `cacheDir`, and a typed dynamic import of the compiled bundle. The pipeline is also exported in pieces — `compileConfig`, `findReusableBundle`, `importConfigModule` — for custom wiring.

## Why

CLIs want typed config modules (for example, `art-workspace.mts`) without asking users to precompile them. The package compiles on demand and reuses the compiled bundle while the sources are unchanged, so repeat runs skip esbuild entirely. It assumes nothing about config location, cache location, or config data shape, so every consumer CLI keeps its own manifest name, cache directory choice, and `defineConfig` authoring surface.

## Definitions

- **Config entry** — the caller-supplied path to the config module source (for example, `.art-workspace.mts`). The package resolves no manifest name of its own.
- **Bundle** — the compiled `config.bundle.mjs` written to the caller-supplied cache directory.
- **Cache metadata** — `config.cache.json`: a versioned record of every esbuild `metafile.inputs` entry with its sha256 content hash, recorded relative to `baseDir`.
- **Reuse** — `findReusableBundle` returns the cached bundle path only while every recorded input still hashes the same; any changed, missing, or unreadable input means rebuild.
- **Bypass** — `cache: false` skips the reuse check, rebuilds, and refreshes the metadata so the next run is warm.

## Consumers

`@art-works/workspace-cli` and `@art-js/test-records` consume published `@art-lib/*` packages pinned at `0.0.3` today (`@art-lib/fs-records`). The Art Workspace Cli is the first committed consumer of `@art-lib/config`: its planned adoption (Iteration: Integrate in Consumer in `_backlog/3-now/plan-add-config/plan.md`) replaces its private compile/cache/import pipeline with this package while keeping its config conventions — `defineConfig`, `.art-workspace.mts`, `node_modules/.art-workspace/` — on its side.

## Use Cases

- Load a config module with caching: `loadConfigModule(entryPath, { cacheDir })`
- Compile without caching: `loadConfigModule(entryPath)` — a temp-dir bundle
- Force a fresh compile that warms the cache: `loadConfigModule(entryPath, { cacheDir, cache: false })`
- Add consumer-specific externals: `loadConfigModule(entryPath, { cacheDir, externals: ['simple-git'] })`
- Custom wiring: `findReusableBundle` → `compileConfig` → `importConfigModule`

## How It Works

`loadConfigModule` orchestrates three pieces:

1. **Reuse** — `findReusableBundle(cacheDir, baseDir)` reads the version- and shape-guarded metadata and re-hashes every recorded input (sha256); it returns the bundle path only while all match.
2. **Compile** — on a cache miss, `compileConfig(entryPath, …)` runs esbuild bundle-at-runtime (`bundle`, `format: 'esm'`, `platform: 'node'`, `metafile: true`), writes the bundle and metadata to `cacheDir`, and falls back to a temp-dir bundle with a warning when the cache is unwritable — caching never fails the run.
3. **Import** — `importConfigModule<T>(bundlePath)` dynamically imports the bundle and returns its default export, typed as `T`.
