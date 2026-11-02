# Design: Config API

**Purpose:** The published surface of `@art-lib/config` — what it exports, the cache contract it guarantees, and how a consumer calls it.

`@art-lib/config@0.0.1` is published on npm: `npm install @art-lib/config`.

## Public Surface

`src/index.ts` exports four functions and four types, and nothing else re-exports across the domain boundaries:

```ts
loadConfigModule<T>(entryPath: string, options?: LoadConfigOptions): Promise<T>;

compileConfig(entryPath: string, options?: LoadConfigOptions): Promise<CompiledConfig>;
findReusableBundle(cacheDir: string, baseDir: string): Promise<string | null>;
importConfigModule<T>(bundlePath: string): Promise<T>;

LoadConfigOptions {
  cacheDir?: string;    // bundle + metadata live here; omit to compile without caching
  cache?: boolean;      // false = bypass reuse, rebuild, refresh (default true)
  baseDir?: string;     // base for recording input paths (default: the entry's directory)
  externals?: string[]; // extra esbuild externals, merged over the package defaults
}

CompiledConfig { bundlePath: string; metafile?: esbuild.Metafile }
ConfigCacheInput { path: string; hash: string }
ConfigCacheMeta { version: number; compiledAt: string; manifest: string; inputs: ConfigCacheInput[] }
```

- `loadConfigModule` — the one-call orchestrator: reuse or compile, then import.
- `compileConfig` — esbuild bundle-at-runtime plus the bundle and metadata write; falls back to a temp dir when `cacheDir` is missing or unwritable.
- `findReusableBundle` — version-, shape-, and sha256-verified reuse; returns the cached bundle path, or `null`.
- `importConfigModule` — dynamic import returning the module's default export.

## Cache Contract

The package owns only the file names **inside** the caller-supplied cache directory — never the directory itself:

| File                | Role                                                                |
| ------------------- | ------------------------------------------------------------------- |
| `config.bundle.mjs` | the compiled bundle                                                 |
| `config.cache.json` | versioned metadata: `version`, `compiledAt`, `manifest`, `inputs[]` |

- **Version- and shape-guarded** — a mismatched `version`, an unparseable body, or a wrong shape means rebuild.
- **Content-based invalidation** — every `metafile.inputs` entry is recorded as a sha256 hash relative to `baseDir`; the bundle is reused only while every input still hashes the same. mtime never decides freshness, because mtimes reset on checkout, restore, and container bind.
- **Default externals** — Node builtins and `esbuild` are external by package default; `options.externals` only adds consumer-specific entries.
- **Graceful degradation** — an unwritable cache falls back to a temp-dir bundle (prefix `art-lib-config-`) with a warning; the load still succeeds.
- **Bypass refreshes** — `cache: false` skips reuse, rebuilds, and rewrites both the bundle and the metadata.

## Usage

### One call

`loadConfigModule<T>` reuses the compiled bundle when its sources are unchanged, compiles on a miss, and returns the module's default export typed as `T`.

```ts
import { join } from 'node:path';

import { loadConfigModule } from '@art-lib/config';

const entryPath = join(workspaceRoot, '.art-workspace.mts');
const cacheDir = join(workspaceRoot, 'node_modules', '.art-workspace');

const config = await loadConfigModule<PartialWorkspaceConfig>(entryPath, {
  cacheDir,
  externals: ['simple-git'],
});

return defineConfig({ ...config, root: { path: workspaceRoot } });
```

Omit `cacheDir` to compile without caching, or pass `cache: false` to force a rebuild that refreshes the cache for the next run.

### Decomposed parts

Reach for the pieces when the caller must know _what happened_ — whether the bundle was reused or rebuilt, a bypass flag, or metrics:

```ts
import { dirname, join, resolve } from 'node:path';

import { compileConfig, findReusableBundle, importConfigModule } from '@art-lib/config';

const entryPath = join(workspaceRoot, '.art-workspace.mts');
const cacheDir = join(workspaceRoot, 'node_modules', '.art-workspace');
const baseDir = dirname(resolve(entryPath));

const reusable = await findReusableBundle(cacheDir, baseDir);
const bundlePath =
  reusable ??
  (await compileConfig(entryPath, { cacheDir, baseDir, externals: ['simple-git'] })).bundlePath;

const config = await importConfigModule<PartialWorkspaceConfig>(bundlePath);

return defineConfig({ ...config, root: { path: workspaceRoot } });
```

This is the shape the Art Workspace Cli uses, minus its logging: `findReusableBundle` decides, `compileConfig` runs only on a miss, and `importConfigModule` loads whichever path resulted. `baseDir` must be the same value passed at write time, or the recorded input paths will not line up.
