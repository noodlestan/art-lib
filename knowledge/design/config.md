# Design: Config

**Purpose:** Describe what a CLI implementor imports from `@art-lib/config` — the compile/cache/import mechanism — extracted from the Art Workspace Cli config implementation and its config-cache plan.

**Planned package:** `@art-lib/config` — `_backlog/4-next/plan-add-config/plan.md`

## Positioning

`@art-lib/config` publishes the **loading mechanism** for typed config modules: compile a TypeScript config entry with esbuild bundle-at-runtime, cache the compiled bundle with content-hash invalidation, and import it typed. The CLI implementor wires it; the package assumes nothing about:

- **Config location** — the caller resolves and passes the entry path (`art-workspace-cli`: `join(root, '.art-workspace.mts')`). No manifest-name or root convention lives in the package.
- **Cache location** — the caller passes the cache directory (`art-workspace-cli`: `join(root, 'node_modules', '.art-workspace')`). The package only defines the file names inside that directory (`config.bundle.mjs`, `config.cache.json`).
- **Config data shape** — generic `T`; the package returns the module's default export untouched. Defaults, normalisation, and `defineConfig` stay in the consumer package (`art-workspace-cli`: `cli/workspace/src/config/defineConfig.ts`).

## Use Cases (from the Art Workspace Cli)

| #   | Use case        | Art Workspace Cli behaviour today                                                                                                                                                          |
| --- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Load**        | `loadWorkspaceConfig(root, { cache?, verbose? })` resolves the manifest, loads-or-compiles it, imports the bundle, then applies `defineConfig` defaults.                                   |
| 2   | **Compile**     | esbuild bundle-at-runtime: `build({ entryPoints, bundle, write: false, format: 'esm', platform: 'node', metafile: true, external: [...] })`; write the bundle + metadata to the cache dir. |
| 3   | **Cache reuse** | `findReusableBundlePath`: read `config.cache.json` (version-guarded, shape-guarded), verify the bundle exists, re-hash every recorded input (sha256), reuse only while all match.          |
| 4   | **Bypass**      | `cache: false` skips the reuse check, rebuilds, and refreshes the cache so the next run is warm.                                                                                           |
| 5   | **Degrade**     | Unwritable cache → warn and fall back to a temp-dir bundle (`os.tmpdir()`); caching never fails the run.                                                                                   |
| 6   | **Import**      | `import(pathToFileURL(bundlePath))`; take `.default`; consumer narrows to its typed config.                                                                                                |

Missing entry, schema defaults, normalisation, and any user-facing messaging are **consumer policies**, not package concerns.

## API Candidates

All locations and shapes are parameters; nothing is derived from conventions.

```ts
// Orchestrator — the import one-call surface
loadConfigModule<T>(entryPath: string, options?: LoadConfigOptions): Promise<T>;

interface LoadConfigOptions {
  cacheDir?: string;    // where bundle + metadata live; omit to compile without caching
  cache?: boolean;      // false = bypass reuse, rebuild, refresh (default true)
  baseDir?: string;     // base for recording input paths relatively (default: entry dir)
  externals?: string[]; // extra esbuild externals, merged over package defaults
}
```

```ts
// Pieces — for custom wiring
compileConfig(entryPath, options): Promise<CompiledConfig>; // esbuild + write bundle/meta; temp-dir fallback
findReusableBundle(cacheDir, baseDir): Promise<string | null>; // version + shape + hash verification
importConfigModule<T>(bundlePath): Promise<T>; // dynamic import, default export
```

```ts
// Cache metadata (published types)
interface ConfigCacheInput {
  path: string;
  hash: string;
}
interface ConfigCacheMeta {
  version: number;
  compiledAt: string;
  manifest: string;
  inputs: ConfigCacheInput[];
}
```

Behavioural contracts carried over from the workspace CLI:

- **Default externals** — node builtins and `esbuild` are external by package default (`art-workspace-cli` hardcodes exactly these plus `simple-git` in its private `compileConfigBundle.ts` today); `externals` only _adds_ consumer-specific entries.
- Metadata is **version-guarded and shape-guarded** — unparseable or mismatched metadata means rebuild.
- Input hashing is **content-based (sha256), never mtime** — mtimes reset on checkout, restore, and container bind.
- Cache **write failure degrades** to a temp bundle with a warning; the load still succeeds.
- `cache: false` **refreshes** the cache during the bypassed run.

## Adoption in the Art Workspace Cli

```ts
// cli/workspace/src/config/loadWorkspaceConfig.ts — after adoption
const entryPath = join(rootPath, '.art-workspace.mts'); // config location: consumer
const cacheDir = join(rootPath, 'node_modules', '.art-workspace'); // cache location: consumer
const config = await loadConfigModule<PartialWorkspaceConfig>(entryPath, {
  cacheDir,
  cache: options.cache,
  externals: ['simple-git'], // the workspace CLI's extra; builtins + esbuild are package defaults
});
return defineConfig({ ...config, root: { path: rootPath } }); // shape policy: consumer
```

The consumer keeps: manifest name, cache directory choice, defaults/normalisation (`defineConfig`), fallback-to-default-when-missing, and all user-facing output.

## Sources

- Art Workspace Cli loader: `$ART_WORKS/cli/workspace/src/config/loadWorkspaceConfig.ts`
- Art Workspace Cli private pipeline: `$ART_WORKS/cli/workspace/src/config/private/` (`compileConfigBundle`, `findReusableBundlePath`, `importConfigBundle`, `hashConfigInputs`, `cache/*`)
- Art Workspace Cli cache plan: `$ART_WORKS/_backlog/0-archive/2026-10-13-plan-add-config-cache/plan.md`
- Consumer `defineConfig`: `$ART_WORKS/cli/workspace/src/config/defineConfig.ts`
