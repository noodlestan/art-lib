# Instructions: `implement-config-loading`

**Plan:** `add-config`

**Iteration Id:** `implement-config-loading`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/implement-config-loading__report.md`.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse: happy face + up to 3 bullet points. The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                         |
| ------------ | ------------------------- | ------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory        |
| `$PROJECT`   | Provided with prompt      | Art Lib repository (this plan). |

## Working Agreements

1. **This instructions file is self-contained.** Everything you need is here plus its mandatory reading — never rely on session memory or chat context.
2. **Your report is mandatory.** The rendered report file carries the full trail; your chat response is only a pointer to it.
3. **User interaction is minimal.** A happy face and up to 3 bullet points. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Implement the typed config loading pipeline of `@art-lib/config`: `loadConfigModule<T>(entryPath, options?)` orchestrating `compileConfig` (esbuild bundle-at-runtime) and `importConfigModule` (typed dynamic import). No cache reuse yet — the content-hash cache lands in the next iteration. Commit as `build(config): Add typed config loading with bundle-at-runtime.`

## Mandatory Reading

- plan: `$PROJECT/_backlog/4-next/plan-add-config/plan.md` — this plan; the iteration Changes list the exact files.
- design: `$PROJECT/knowledge/design/config.md` — behavioural contracts: default externals, temp-dir fallback, import semantics.
- knowledge: `$PROJECT/knowledge/index.md` — package layout and publishing conventions.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci
npm run ci # verify build is green before starting
```

Do NOT run `npm install` inside `$PROJECT/libs/config` — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Instructions:** (From `$PROJECT/_guide.md`) — from `$PROJECT/libs/config/`:

```bash
npm run lint:fix
npm run lint
npm run build
npm run test
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Changes

- Step 1 / 4 — Add config types in `types.ts`.
- Step 2 / 4 — Implement `compileConfig`, `importConfigModule`, and `loadConfigModule`.
- Step 3 / 4 — Add unit tests and export from `src/index.ts`.
- Step 4 / 4 — Commit `add-config-loading`.

## Steps

### Step `1 / 4` — Add config types

**`$PROJECT/libs/config/src/types.ts`**

```ts
import type { Metafile } from 'esbuild';

export interface LoadConfigOptions {
  cacheDir?: string; // where bundle + metadata live; omit to compile without caching
  cache?: boolean; // false = bypass reuse, rebuild, refresh (default true)
  baseDir?: string; // base for recording input paths relatively (default: entry dir)
  externals?: string[]; // extra esbuild externals, merged over package defaults
}

export interface CompiledConfig {
  bundlePath: string; // where the compiled bundle was written
  metafile: Metafile; // esbuild metafile (inputs are hashed by the cache iteration)
}

export interface ConfigCacheInput {
  path: string;
  hash: string;
}

export interface ConfigCacheMeta {
  version: number;
  compiledAt: string;
  entry: string;
  inputs: ConfigCacheInput[];
}
```

- `ConfigCacheInput` and `ConfigCacheMeta` are declared here for the cache iteration that follows; export them now, do not write metadata files yet beyond what `compileConfig` produces when `cacheDir` is given (step 2).

### Step `2 / 4` — Implement the loading modules

**`$PROJECT/libs/config/src/compileConfig.ts`**

```ts
export async function compileConfig(
  entryPath: string,
  options?: LoadConfigOptions,
): Promise<CompiledConfig>;
```

- Throw a clear error when `entryPath` does not exist: `Config entry not found: {entryPath}` — do not let esbuild produce the only signal.
- Build with esbuild: `{ entryPoints: [entryPath], bundle: true, write: false, format: 'esm', platform: 'node', metafile: true, external: [...] }`.
- Default externals are the node builtins (`builtinModules` from `node:module`) plus `'esbuild'`; `options.externals` only adds consumer entries over those defaults.
- When `options.cacheDir` is given: write the bundle to `{cacheDir}/config.bundle.mjs`. When it is absent: write the bundle to a fresh temp directory (`os.tmpdir()`).
- If writing to `cacheDir` fails (unwritable directory), degrade: emit a warning with `console.warn` and fall back to a temp-dir bundle. A cache write failure must never fail the run.
- Return `{ bundlePath, metafile }`.

**`$PROJECT/libs/config/src/importConfigModule.ts`**

```ts
export async function importConfigModule<T>(bundlePath: string): Promise<T>;
```

- `const mod = await import(pathToFileURL(bundlePath).href); return (mod as { default: T }).default;`

**`$PROJECT/libs/config/src/loadConfigModule.ts`**

```ts
export async function loadConfigModule<T>(
  entryPath: string,
  options?: LoadConfigOptions,
): Promise<T>;
```

- Orchestrate: `compileConfig(entryPath, options)` → `importConfigModule<T>(compiled.bundlePath)`.
- There is no cache reuse in this iteration — a later iteration inserts `findReusableBundle` between compile and import. Leave a single, obvious seam for it.
- Apply `baseDir` defaulting here or in `compileConfig` consistently: when absent, default to the entry file's directory (`path.dirname(entryPath)`).

### Step `3 / 4` — Add unit tests and exports

**`$PROJECT/libs/config/src/loadConfigModule.test.ts`** (plus a small fixture config entry under the package's test fixtures, mirroring `libs/fs-records` test layout):

- loads a fixture config entry from a caller-supplied path and returns its default export;
- resolves imports that come from the consumer `node_modules` (the fixture imports one workspace dependency);
- throws the clear `Config entry not found:` error when the entry is missing;
- works without a `cacheDir` (temp-bundle path) and with a `cacheDir` (bundle written there).

Update `$PROJECT/libs/config/src/index.ts` to export `loadConfigModule`, `compileConfig`, `importConfigModule`, and the types from step 1.

Verify from `$PROJECT/libs/config/`: `npm run lint`, `npm run build`, `npm run test`.

### Step `4 / 4` — Commit `add-config-loading`

#### Commit: `add-config-loading`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```text
build(config): Add typed config loading with bundle-at-runtime.

- Add `compileConfig`, `importConfigModule`, and the `loadConfigModule` orchestrator.
- Cover fixture loading, missing entry, and temp-bundle paths with tests.
```

---

## Final Verification

- Verify that the commit has been executed according to the commit's policy.
- Verify `loadConfigModule` is the only orchestration surface and the compile→import seam is obvious for the cache iteration.
- Verify `compileConfig` never fails on an unwritable `cacheDir` — it warns and falls back to a temp bundle.
- Verify the default externals are node builtins + `esbuild`, merged with caller `externals`.
- Verify no cache reuse logic exists yet (that is the next iteration).
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
