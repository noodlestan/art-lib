# Instructions: `implement-config-loading`

**Plan:** `add-config`

**Iteration Id:** `implement-config-loading`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-add-config/instructions/implement-config-loading__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `implement-config-loading`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                        |
| ------------ | ------------------------- | ------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory       |
| `$PROJECT`   | Provided with Prompt      | Art Lib repository             |
| `$PACKAGE`   | `$PROJECT/libs/config`    | The `config` package to modify |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `implement-config-loading`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Implement typed config authoring and esbuild bundle-at-runtime loading. `loadConfigModule<T>(entryPath, options?)` compiles a caller-supplied config entry with esbuild and imports the default export.

## Mandatory Reading

- `$PROJECT/_guide.md` — repository layout, records management, conventions, and operating instructions.
- `$PROJECT/libs/fs-records/_guide.md` — package layout and conventions to mirror.
- `$PROJECT/knowledge/components.md` — package components and planned packages.
- `$PROJECT/knowledge/design/config.md` — API and behavioral contracts for config loading.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
npm run ci # to verify build is green before starting
```

If either command fails, resolve the issue before implementation. Do NOT run `npm install` inside `$PROJECT/libs/config` — a local `node_modules` there shadows monorepo resolution and breaks the build.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from `$PROJECT/libs/config`:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run build
npm run test
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Changes

This iteration implements typed config loading with esbuild bundle-at-runtime. No cache reuse yet (next iteration).

- Step 1 / 7 — Create `types.ts`
- Step 2 / 7 — Create `compileConfig.ts`
- Step 3 / 7 — Create `importConfigModule.ts`
- Step 4 / 7 — Create `loadConfigModule.ts`
- Step 5 / 7 — Create `loadConfigModule.test.ts`
- Step 6 / 7 — Update `src/index.ts` exports
- Step 7 / 7 — Commit `add-config-loading`

## Steps

### Step `1 / 7` — Create `types.ts`

Create `$PACKAGE/src/types.ts`:

```ts
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
```

Expected outcome: type declarations for the config package.

### Step `2 / 7` — Create `compileConfig.ts`

Create `$PACKAGE/src/compileConfig.ts` with esbuild bundle-at-runtime:

- `compileConfig(entryPath, options)` — esbuild `bundle-at-runtime` with `metafile: true`; externals = package defaults merged with caller `externals`.
- Default externals: node builtins + `esbuild`.
- When `cacheDir` is given, write bundle + metadata there.
- Temp-dir fallback on write failure (graceful degradation).
- Returns `CompiledConfig` with `bundlePath` and `metafile`.

Expected outcome: `compileConfig.ts` compiles a config entry to a bundle.

### Step `3 / 7` — Create `importConfigModule.ts`

Create `$PACKAGE/src/importConfigModule.ts`:

- `importConfigModule<T>(bundlePath)` — dynamic import via `import(pathToFileURL(bundlePath))`; returns the default export as `T`.

Expected outcome: `importConfigModule.ts` dynamically imports a compiled bundle.

### Step `4 / 7` — Create `loadConfigModule.ts`

Create `$PACKAGE/src/loadConfigModule.ts` orchestrating compile → import:

```ts
export async function loadConfigModule<T>(
  entryPath: string,
  options?: LoadConfigOptions,
): Promise<T> {
  const compiled = await compileConfig(entryPath, options);
  return importConfigModule<T>(compiled.bundlePath);
}
```

Expected outcome: `loadConfigModule.ts` orchestrates compile → import.

### Step `5 / 7` — Create `loadConfigModule.test.ts`

Create `$PACKAGE/src/loadConfigModule.test.ts` with tests:

- loads a fixture config entry from a caller-supplied path
- resolves imports from the consumer `node_modules`
- propagates the compiler's actionable error when the entry is missing; do not add a consumer-specific fallback or messaging policy
- works without a `cacheDir` (temp bundle)

Expected outcome: tests pass.

### Step `6 / 7` — Update `src/index.ts` exports

Update `$PACKAGE/src/index.ts` to export:

```ts
export { loadConfigModule } from './loadConfigModule.js';
export { compileConfig } from './compileConfig.js';
export { importConfigModule } from './importConfigModule.js';
export type {
  LoadConfigOptions,
  CompiledConfig,
  ConfigCacheInput,
  ConfigCacheMeta,
} from './types.js';
```

Expected outcome: public surface exported.

### Step `7 / 7` — Commit `add-config-loading`

---

#### Commit: `add-config-loading`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(config): Add typed config loading with bundle-at-runtime.

- Add `compileConfig`, `importConfigModule`, and the `loadConfigModule` orchestrator.
- Cover fixture loading, missing entry, and temp-bundle paths with tests.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify `@art-lib/config` builds, lints, and tests green from `$PACKAGE`.
- Verify `loadConfigModule<T>(entryPath, options?)` compiles and imports a config entry.
- Verify `compileConfig` uses esbuild bundle-at-runtime with `metafile: true`.
- Verify `importConfigModule` returns the default export as `T`.
- Verify all new modules are exported from `src/index.ts`.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
