# Art Lib Config - Loading and Cache

## Decision: No Conventions in the Package

**Status:** Adopted

**Context:** Every CLI that loads typed config has its own conventions: manifest name, cache directory, and config shape with a `defineConfig` authoring surface. The Art Workspace Cli hardcodes `.art-workspace.mts` and `node_modules/.art-workspace/`. A shared package that adopted any of these would force every other consumer to fight it.

**Decision:** Config entry path, cache directory, and config data shape are caller parameters of `loadConfigModule`; the package makes no conventions its own. Consumer CLIs keep manifest name, cache location, defaults, normalisation, and `defineConfig` on their side.

**Consequences:** The package stays a thin, convention-free mechanism; each consumer wires its own policy. No manifest discovery or schema validation lives here.

## Decision: Content-Hash Cache Invalidation — sha256, Not mtime

**Status:** Adopted

**Context:** Compiled bundles must be reused only while their sources are unchanged. mtime-based checks are unreliable: mtimes reset on checkout, restore, and container bind, causing either spurious rebuilds or stale reuse.

**Decision:** Record a sha256 content hash for every esbuild `metafile.inputs` entry in `config.cache.json`, relative to `baseDir`, and reuse the cached bundle only while every recorded input still hashes the same.

**Consequences:** Reuse is correct across checkouts and containers. Any changed, missing, or unreadable input — like missing or unparseable metadata, or a version mismatch — triggers a rebuild.

## Decision: Graceful Degradation on Unwritable Cache

**Status:** Adopted

**Context:** The cache directory may be read-only — global installs, locked-down CI, permission drift. Config loading sits on a CLI's startup path; a cache failure must not take the CLI down.

**Decision:** A cache write failure falls back to a temp-dir bundle and emits a warning; the load still succeeds. Caching never fails the run.

**Consequences:** Consumers can always pass a `cacheDir` without guarding it. The degraded run costs one esbuild compile and logs a warning.

## Decision: `cache: false` Refreshes the Cache

**Status:** Adopted

**Context:** A bypass option exists for "reload now" flows (dev watchers, `--no-cache` flags). A bypass that only skipped reading the cache would leave the stale bundle in place for the next run.

**Decision:** `options.cache === false` skips the reuse check, rebuilds, and rewrites the bundle and metadata, so the next run is warm.

**Consequences:** One bypassed run restores freshness; callers do not need a separate "clear the cache" operation.

## Decision: Domain Layout With a Cross-Domain `private/`

**Status:** Adopted

**Context:** The package has four pipeline domains (compile, load, module, cache) plus shared helpers. A flat `src/` root did not express ownership, and scattering shared helpers would duplicate them.

**Decision:** One directory per domain: `compile/`, `load/`, `module/`, `cache/`. A helper goes beside the single module that calls it; only cross-domain helpers live in `private/`. `writeConfigBundle` and `createConfigCacheMeta` sit in `compile/` — the mechanical import graph beat the semantic "cache write half" reading, with `private/constants.ts` as the shared cache-format contract between the two sides.

**Consequences:** Import direction stays one-way per domain; the cache write half (`compile/`) and read half (`cache/`) meet only through `private/constants.ts`.
