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

`@art-works/workspace-cli` is now a **real consumer**: it adopts the published `@art-lib/config@0.0.1`, replacing its private compile/cache/import pipeline with this package's decomposed API (`findReusableBundle`, `compileConfig`, `importConfigModule`). It keeps its own conventions on its side — `defineConfig`, the `.art-workspace.mts` manifest at the workspace root, the cache under `node_modules/.art-workspace/`, and the `--no-config-cache` bypass. Adoption landed in `checkouts/art-works` as `9cabc4f`, released as `@art-works/workspace-cli@0.3.1`.

`@art-js/test-records` consumes `@art-lib/fs-records@0.0.3`; `@art-works/workspace-cli` consumes that package too. Both are pinned to published versions.

## Use Cases

| #   | Use case        | Behaviour                                                                                                                                                      |
| --- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Load**        | `loadConfigModule(entryPath, { cacheDir })` resolves the entry, reuses or compiles it, imports the bundle, and returns the default export typed as `T`.        |
| 2   | **Compile**     | esbuild bundle-at-runtime: `bundle`, `write: false`, `format: 'esm'`, `platform: 'node'`, `metafile: true`; the bundle and metadata are written to `cacheDir`. |
| 3   | **Cache reuse** | Read `config.cache.json` (version-guarded, shape-guarded), verify the bundle exists, re-hash every recorded input (sha256), reuse only while all match.        |
| 4   | **Bypass**      | `cache: false` skips the reuse check, rebuilds, and refreshes the cache so the next run is warm.                                                               |
| 5   | **Degrade**     | Unwritable cache → warn and fall back to a temp-dir bundle; caching never fails the run.                                                                       |
| 6   | **Import**      | `import(pathToFileURL(bundlePath))`; take `.default`; the consumer narrows to its own config type.                                                             |

A missing entry, schema defaults, normalisation, and any user-facing message are **consumer policies**, not package concerns. The surface behind these cases is documented in [`design/api.md`](design/api.md).

## How It Works

`loadConfigModule` orchestrates three pieces:

1. **Reuse** — `findReusableBundle(cacheDir, baseDir)` reads the version- and shape-guarded metadata and re-hashes every recorded input (sha256); it returns the bundle path only while all match.
2. **Compile** — on a cache miss, `compileConfig(entryPath, …)` runs esbuild bundle-at-runtime (`bundle`, `format: 'esm'`, `platform: 'node'`, `metafile: true`), writes the bundle and metadata to `cacheDir`, and falls back to a temp-dir bundle with a warning when the cache is unwritable — caching never fails the run.
3. **Import** — `importConfigModule<T>(bundlePath)` dynamically imports the bundle and returns its default export, typed as `T`.
