# @art-lib/config

> Typed config loading with bundle-at-runtime compilation and content-hash cache.

This package is part of the [Art Lib toolkit](../../README.md).

## Design

The package publishes the **loading mechanism** only: compile a TypeScript config entry with esbuild, cache the compiled bundle, and import it typed. It assumes nothing about your config location, your cache directory, or your config data shape — you pass all three.

Cache reuse is content-based: every esbuild input is recorded as a sha256 hash and the bundle is reused only while all inputs still match, so mtimes never decide freshness. An unwritable cache degrades to a temp-dir bundle with a warning, and caching never fails the run.

## Usage

```ts
import { loadConfigModule } from '@art-lib/config';

type WorkspaceConfig = {
  root: string;
  verbose?: boolean;
};

const entryPath = '.art-workspace.mts';
const cacheDir = 'node_modules/.art-workspace';

const config = await loadConfigModule<WorkspaceConfig>(entryPath, {
  cacheDir,
  externals: ['simple-git'],
});

console.log(config.root);
```

Options accepted by `loadConfigModule`:

- **`cacheDir`** — where the bundle (`config.bundle.mjs`) and its metadata (`config.cache.json`) live. Omit it to compile without caching.
- **`cache`** — set to `false` to bypass reuse, rebuild, and refresh the cache so the next run is warm. Defaults to `true`.
- **`baseDir`** — base for recording input paths relatively. Defaults to the entry's directory.
- **`externals`** — extra esbuild externals, merged over the package defaults (Node builtins and `esbuild`).

The same pipeline is also exported in pieces, for custom wiring:

```ts
// Continuing from the example above — the same pipeline, taken apart.
import { compileConfig, findReusableBundle, importConfigModule } from '@art-lib/config';

const baseDir = process.cwd(); // must match the baseDir used when the bundle was written

const reusable = await findReusableBundle(cacheDir, baseDir);
const bundlePath = reusable ?? (await compileConfig(entryPath, { cacheDir })).bundlePath;
const config = await importConfigModule<WorkspaceConfig>(bundlePath);
```

## Development

Make sure you read the [Art Lib README](../../README.md) first.

### Build Targets

This package is meant for use in Node.js environments. The entry point is built using `esbuild` pre-configured by [Workspace Tooling](https://github.com/noodlestan/workspace-tooling).

### Scripts

- **$** `npm run dev` — Watch mode for development
- **$** `npm run lint` — Check formatting, lint, and type check
- **$** `npm run lint:fix` — Fix formatting and lint issues
- **$** `npm run build` — Build the package
- **$** `npm run build:clean` — Remove build artifacts
- **$** `npm run test` — Run tests
- **$** `npm run ci` — Run CI pipeline

## Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
