# Plan: Add Config Package

**ID:** `add-config`

**Status:** `WORKING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Load, compile, and cache typed config modules (for example, `something.config.mts`).

**Description:** Create the `@art-lib/config` package: `loadConfigModule<T>(entryPath, options?)` — esbuild bundle-at-runtime compilation of a caller-supplied config entry, an optional content-hash cache in a caller-supplied `cacheDir`, a `cache: false` bypass that refreshes the cache, and graceful degradation when the cache is unwritable. The package assumes nothing about config location, cache location, or config data shape.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                    | Purpose                                                    |
| ------------ | -------------------------------- | ---------------------------------------------------------- |
| `$WORKSPACE` | Current working directory        | Workspace root directory                                   |
| `$PROJECT`   | Provided with Prompt             | Art Lib repository .                                       |
| `$ART_WORKS` | `$WORKSPACE/checkouts/art-works` | Art Works checkout for the consumer integration iteration. |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains`     | Domain resources directory                                 |

## Summary

Create `@art-lib/config` with `loadConfigModule<T>(entryPath, options?)`: esbuild bundle-at-runtime compilation, an optional content-hash cache under a caller-supplied `cacheDir`, graceful degradation when the cache is unavailable, and a `cache: false` bypass. Entry path, cache directory, and config shape are all caller-supplied — the package makes no conventions its own.

## Context

### Upstream Work

| Kind        | Path                                                         | Role                                                            |
| ----------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| Parking Lot | `$PROJECT/_backlog/_parking-lot.md`                          | Tracks short-term actionables, pending questions, and blockers. |
| Milestone   | `$PROJECT/_roadmap/3-now/milestone-art-lib-one/milestone.md` | Scope for the config capability.                                |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$PROJECT/knowledge/design/config.md` (Design) — Consumer requirements from the Art Workspace Cli and its config-cache plan. Relevant for Planning Work Item.

::READ `$PROJECT/knowledge/index.md` (Model) — Package layout and publishing conventions. Relevant for Planning Work Item.

## Scope

Create `$PROJECT/libs/config` exposing `loadConfigModule`, the lower-level `compileConfig` / `findReusableBundle` / `importConfigModule` pieces, and the cache metadata types — with esbuild bundle-at-runtime compilation, a caller-supplied cache directory, and a bypass option — plus tests, package records, and docs mirroring `libs/fs-records` conventions. Integrate the published package into the Art Workspace Cli at `$ART_WORKS/cli/workspace`. Config location, cache location, defaults, and schema stay with each consumer CLI.

## Work

### Next

- **Six of eight iterations are `DONE`** — `ef23a68`, `b5de21e`, `92619ad`, `8f2d84e`, `3f3a975`, `21da36b`. The package is complete, policy-compliant, documented, and wired into every repository artefact. It is **not published and not installed anywhere**.
- Next: **Iteration: Publish Config Package** (`READY`, added 2026-11-01) — publish `@art-lib/config@0.0.1`, flip both records to the deployed state, and commit `publish-config`. This iteration exists because the plan originally gated `Integrate in Consumer` on publishing while providing no way to publish; it is the missing step.
- Then **Iteration: Integrate in Consumer** — its GATE now reads against `Publish Config Package` being `DONE`, so it becomes executable once the registry serves `0.0.1`.
- Publishing is irreversible: a bad `0.0.1` requires a bump, and unpublishing is restricted. The iteration hard-stops on any precondition failure and on a two-factor one-time-password challenge rather than retrying.

### Blockers

- None.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/setting-up.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
npm run ci # to verify build is green before starting
```

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$PROJECT` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.

2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run build
npm run test
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Items:

| Iteration / Instructions                | Status  |
| --------------------------------------- | ------- |
| Iteration: Scaffold Config Package      | `DONE`  |
| Iteration: Implement Config Loading     | `DONE`  |
| Iteration: Implement Config Cache       | `DONE`  |
| Iteration: Apply Noodlestan Conventions | `DONE`  |
| Iteration: Restructure Config Package   | `DONE`  |
| Iteration: Update Knowledge             | `DONE`  |
| Iteration: Publish Config Package       | `READY` |
| Iteration: Integrate in Consumer        | `READY` |

> `Iteration: Apply Noodlestan Conventions` committed no standalone message: its staged changes rode into `Restructure Config Package`'s `8f2d84e`, which both rows now carry.
>
> **Six of eight iterations are `DONE`.** `Publish Config Package` was added 2026-11-01 to lift the gate that had left `Integrate in Consumer` unreachable — the plan originally contained a gated iteration with no publish step to satisfy it. Publishing `0.0.1` is what unblocks the final iteration.

### Iteration: Scaffold Config Package

**Id:** `scaffold-config-package`

**Status:** `DONE`

**Purpose:** Create the `config` package skeleton before adding modules.

**Description:** Scaffold `$PROJECT/libs/config` mirroring `libs/fs-records` conventions: `package.json` (root export; runtime dependency on `esbuild`), tsconfig, vitest config, npm scripts, `_guide.md`, `_records/package.art`, `src/index.ts` placeholder.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./plan-add-config/instructions/scaffold-config-package.md`

**Report:** `./plan-add-config/instructions/scaffold-config-package__report.md`

**Delegation:** `COMPLETED` — worker session `ses_e6beade26ffeoL6MYKxdddrsZG`.

**Changes:**

In `$PROJECT/libs/config`

- Create `package.json` — name `@art-lib/config`, root export, runtime dependency `esbuild`, scripts mirroring `libs/fs-records`.
- Create `tsconfig.json` and vitest config extending the monorepo configs.
- Create `src/index.ts` as placeholder entry point.
- Create `_guide.md` describing the package and operating instructions.
- Create `_records/package.art` mirroring `libs/fs-records/_records`.

**Dependencies:**

- None.

#### Commits:

| ID                | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ----------------- | ------------------------------ | ------------ | --------- | ----------- |
| `scaffold-config` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `ef23a68` | `COMMITTED` |

##### Commit: `scaffold-config`

**Message:**

```text
scaffold(config): Scaffold package skeleton.

- Create manifest, tsconfig, vitest config, and scripts mirroring `libs/fs-records`.
- Add `_guide.md` and `_records/package.art`.
```

**Hash:** `ef23a68` — pushed to `origin/main`.

**Status:** `COMMITTED`

### Iteration: Implement Config Loading

**Id:** `implement-config-loading`

**Status:** `DONE`

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./plan-add-config/instructions/implement-config-loading.md`

**Report:** `./plan-add-config/instructions/implement-config-loading__report.md`

**Delegation:** `COMPLETED` — worker session `ses_e6bd6578bffehB5CAiJxceUWzg`.

**Purpose:** Implement typed config authoring and esbuild bundle-at-runtime loading.

**Description:** Implement `src/` with `loadConfigModule<T>(entryPath, options?)` and the pieces beneath it: `compileConfig(entryPath, options)` (esbuild `bundle-at-runtime` with `metafile: true`; externals = package defaults merged with caller `externals`), `importConfigModule<T>(bundlePath)` (dynamic import, default export). Without a `cacheDir`, compile to a temp `.mjs` and import; with one, write bundle + metadata there. Unit tests.

**Changes:**

In `$PROJECT/libs/config/src/`

- `types.ts` — `LoadConfigOptions { cacheDir?, cache?, baseDir?, externals? }`, `CompiledConfig`, `ConfigCacheInput`, `ConfigCacheMeta`.
- `compileConfig.ts` — esbuild bundle-at-runtime with default externals (node builtins + `esbuild`) merged with caller `externals`; writes bundle + metadata when `cacheDir` is given; temp-dir fallback on write failure.
- `importConfigModule.ts` — `import(pathToFileURL(bundlePath))`; returns the default export as `T`.
- `loadConfigModule.ts` — orchestrates compile-or-reuse (cache lands next iteration) → import.
- `loadConfigModule.test.ts` — loads a fixture config entry from a caller-supplied path; resolves imports from the consumer `node_modules`; propagates the compiler's actionable error when the entry is missing (without adding a consumer-specific fallback or messaging policy); works without a `cacheDir` (temp bundle).
- Update `src/index.ts` exports.

**Dependencies:**

- Iteration: Scaffold Config Package.

#### Commits:

| ID                   | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| -------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `add-config-loading` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `b5de21e` | `COMMITTED` |

##### Commit: `add-config-loading`

**Message:**

```text
build(config): Add typed config loading with bundle-at-runtime.

- Add `compileConfig`, `importConfigModule`, and the `loadConfigModule` orchestrator.
- Cover fixture loading, missing entry, and temp-bundle paths with tests.
```

**Hash:** `b5de21e` — pushed to `origin/main` (`ef23a68..b5de21e`).

**Status:** `COMMITTED`

### Iteration: Implement Config Cache

**Id:** `implement-config-cache`

**Status:** `DONE`

**Purpose:** Reuse the compiled config while its sources are unchanged; bypass on demand.

**Description:** Add the content-hash cache inside the caller-supplied `cacheDir` (`config.bundle.mjs` + `config.cache.json` with a sha256 per esbuild `metafile.inputs` entry, recorded relative to `baseDir`, and a `version` field). Reuse the cached bundle only while every recorded input hashes the same; changed/missing/unreadable input, missing bundle, unparseable metadata, or version mismatch triggers a rebuild. Unwritable cache degrades to a temp bundle with a warning — never fails the run. `options.cache === false` bypasses reuse, rebuilds, and refreshes the cache. Unit tests.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./plan-add-config/instructions/implement-config-cache.md`

**Report:** `./plan-add-config/instructions/implement-config-cache__report.md`

**Delegation:** `COMPLETED` — worker session `ses_e6bb955a2ffeVWAqVkvCACP2A7`.

**Changes:**

In `$PROJECT/libs/config/src/`

- `cache.ts` — `findReusableBundle(cacheDir, baseDir)`, metadata read/write with version and shape guards, input-hash verification (sha256, content-based).
- `loadConfigModule.ts` — integrate cache check before `build()`; `metafile: true`; bypass via `options.cache === false` (still refreshes).
- `loadConfigModule.test.ts` — valid cache skips rebuild; edited source rebuilds; imported-file change rebuilds; missing/unparseable/version-mismatch rebuilds; unwritable cache degrades to temp; bypass rebuilds and refreshes.
- Update `src/index.ts` exports.

**Dependencies:**

- Iteration: Implement Config Loading.

#### Commits:

| ID                 | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ------------------ | ------------------------------ | ------------ | --------- | ----------- |
| `add-config-cache` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `92619ad` | `COMMITTED` |

##### Commit: `add-config-cache`

**Message:**

```text
build(config): Add content-hash config cache with bypass.

- Reuse the cached bundle only while every recorded input hash matches.
- Degrade to a temp bundle when the cache is unwritable; `cache: false` refreshes.
```

**Hash:** `92619ad` — pushed to `origin/main` (`b5de21e..92619ad`).

**Status:** `COMMITTED`

### Iteration: Apply Noodlestan Conventions

**Id:** `apply-noodlestan-conventions`

**Status:** `DONE`

**Purpose:** Align `libs/config` with the Noodlestan conventions adopted in this workspace.

**Description:** Audit the package against the conventions declared in `$PROJECT/_guide.md` (TypeScript, unit tests) using the `manage-conventions` skill, install what is missing, and resolve the findings — without changing the package behaviour. Commit as `style(config): Apply Noodlestan conventions.`

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$PROJECT/libs/config`

- Discover, install, and audit the conventions applicable to the package with the `manage-conventions` skill.
- Resolve findings: package scripts, tsconfig, lint/test wiring, and convention-mandated files.
- Declare newly installed conventions in `$PROJECT/_guide.md` under `## Conventions`.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above, keeping the package behaviour identical.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.
- Read `$PROJECT/knowledge/design/config.md`; keep the package behavior aligned with its contracts while applying conventions.

Validate that:

- Every convention that applies to the package is installed and its findings are resolved.
- `npm run ci` passes from the `$WORKSPACE` root.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/config/`.
- The commit `apply-conventions-config` has policy `MANUAL` — stage the changes, report back with the proposed commit message; do not commit.

Proposed message:

```text
style(config): Apply Noodlestan conventions.

- Adopt the conventions that apply to the package and resolve audit findings.
```

**Dependencies:**

- Iteration: Implement Config Cache.

#### Commits:

| ID                         | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| -------------------------- | ------------------------------ | -------- | --------- | ----------- |
| `apply-conventions-config` | Art Lib / `$PROJECT` / `main`  | `MANUAL` | `8f2d84e` | `COMMITTED` |

##### Commit: `apply-conventions-config`

**Message:**

```text
style(config): Apply Noodlestan conventions.

- Adopt the conventions that apply to the package and resolve audit findings.
```

**Folded into `restructure-config` — resolved 2026-11-01.** No separate commit was made under this ID: the staged changes were committed together with `Iteration: Restructure Config Package`, whose `Changes` described them and whose `Instructions` deliberately excluded them. The row therefore carries `8f2d84e`, the `restructure-config` hash. The `style(config)` message was never used as a standalone commit; the squash landed under the `refactor(config)` message.

### Iteration: Restructure Config Package

**Id:** `restructure-config-package`

**Status:** `DONE`

**Purpose:** Restructure `libs/config/src` into domain modules, complete the package metadata, and land the staged conventions and dependency changes.

**Description:** Move the four public modules out of the flat `src/` root into `compile/`, `load/`, `module/`, and `cache/`, relocating each module's single-domain private helpers beside it while keeping only cross-domain helpers in `src/private/`. Drop the two dead re-exports in `cache.ts`. Complete the package metadata that `libs/fs-records` carries and that `package.json` and `_records/package.art` already imply: `LICENSE-MIT`, `CHANGELOG.md`, `.npmignore`, `_records/npm-deployment.art`, plus `sideEffects` and `engines`. Commit the changes already staged by `Iteration: Apply Noodlestan Conventions` alongside this work. No behaviour or public-API change.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

**Part A — already staged; committed by this iteration, but NOT yours to execute:**

- `$PROJECT/libs/config/.prettierignore` — added by `Iteration: Apply Noodlestan Conventions`.
- `$PROJECT/libs/config/_guide.md` — corrected `src/` tree.
- `$PROJECT/libs/config/src/types.ts` — 4× `interface` → `type` (No Interface rule).
- `$PROJECT/libs/config/package.json` — `esbuild` pinned to `0.28.2`, the canonical version in `$WORKSPACE/checkouts/management/_ops/packages/dependencies.md`. The previous `^0.24.0` range let npm resolve a second esbuild into `libs/config/node_modules/`, shadowing the monorepo root; the pin removes that cause.
- `$PROJECT/package-lock.json` — refreshed for the pin.

**Part B — execute this:**

1. Restructure `$PROJECT/libs/config/src/` to the target layout below. Move files, update every import specifier, and keep the public surface identical.

   ```text
   src/
   ├── index.ts                          # public entry — same 4 functions + 4 types
   ├── types.ts                          # shared by several domains, stays at root
   ├── compile/
   │   ├── compileConfig.ts
   │   └── getConfigExternals.ts, hashConfigInputs.ts,
   │       writeConfigBundle.ts, createConfigCacheMeta.ts
   ├── load/
   │   ├── loadConfigModule.ts
   │   └── loadConfigModule.test.ts
   ├── module/
   │   └── importConfigModule.ts
   ├── cache/
   │   ├── findReusableBundle.ts          # renamed from cache.ts
   │   └── hasUnchangedConfigInputs.ts, isFilePresent.ts, readConfigCacheMeta.ts,
   │       tryHashConfigCacheInputs.ts, isConfigCacheMeta.ts, isConfigCacheInput.ts
   └── private/                           # cross-domain helpers ONLY
       ├── constants.ts                   # cache + read + write
       ├── resolveConfigBaseDir.ts        # compile + load
       └── hashConfigInputPaths.ts        # compile + cache
   ```

   Placement rule applied: a helper goes beside the module that calls it, unless more than one module calls it, in which case it stays in `src/private/`.

2. Rename `cache.ts` → `cache/findReusableBundle.ts` and **delete both dead re-exports**:

   ```ts
   export { readConfigCacheMeta } from './private/readConfigCacheMeta.js';
   export { isConfigCacheMeta } from './private/isConfigCacheMeta.js';
   ```

   Neither is in `index.ts`, neither has a consumer, neither appears in a test, and `libs/fs-records` has no re-export chain outside its `index.ts`.

3. Complete the package metadata, mirroring `$PROJECT/libs/fs-records`:

   - `LICENSE-MIT` (new) — copy verbatim from `$PROJECT/libs/fs-records/LICENSE-MIT`.
   - `CHANGELOG.md` (new) — `# CHANGELOG`, `## 0.0.1`, `### Added`, summarising the exported surface (`loadConfigModule`, `compileConfig`, `importConfigModule`, `findReusableBundle`, and the four option/cache types).
   - `.npmignore` (new) — `*.test.ts` and `*.test.tsx`, mirroring `libs/fs-records`.
   - `_records/npm-deployment.art` (new) — mirror the shape of `$PROJECT/libs/fs-records/_records/npm-deployment.art`, setting `Status` to `PLANNED` and `Canonical Name` to `@art-lib/config`. `PLANNED` is correct: the deployment status vocabulary is `PLANNED`, `PROVISIONED`, `DEPLOYED`, `FAILED`, and this package is not yet published.
   - `package.json` — add `"sideEffects": false` and `"engines": { "node": ">=22" }`, matching `libs/fs-records` and the `**Engines:**` already declared in `_records/package.art`.
   - Do **NOT** create `README.md` or `knowledge/` — `Iteration: Update Knowledge` owns both.

4. Verify `$PROJECT/libs/config/node_modules` does **not** exist — check the filesystem, not `git status`, because `node_modules/` is gitignored and will never show as dirty. Remove it if present. With `esbuild` pinned to `0.28.2` (Part A), `npm ci` from the `$WORKSPACE` root no longer nests a second copy.

5. Do not change runtime behaviour, the exported symbol names, or the public API.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute **Part B only**. Part A is already staged by the previous iteration: leave those five files exactly as they are and do not re-derive them — your commit will include them.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.
- Read `$PROJECT/knowledge/design/config.md`; keep the package behaviour aligned with its contracts.

Validate that:

- Every exported symbol still resolves from `src/index.ts`: `loadConfigModule`, `compileConfig`, `importConfigModule`, `findReusableBundle`, `LoadConfigOptions`, `CompiledConfig`, `ConfigCacheInput`, `ConfigCacheMeta`.
- No file outside `src/index.ts` contains an `export { … } from` or `export type { … } from` re-export chain.
- No file declares more than one **exported** function. Unexported local helpers may be co-located — `libs/fs-records/src/private/filterByKinds.ts` is the precedent, and `writeConfigBundle.ts` / `hashConfigInputPaths.ts` already follow it. This constraint exists so the move does not create new multi-export modules, not to split existing helpers.
- `npm run ci` passes from the `$WORKSPACE` root.
- From `$PROJECT/libs/config/`: `npm run lint:fix`, `npm run lint`, `npm run build`, `npm run test` all pass (16/16).
- `npm pack --dry-run` from `$PROJECT/libs/config` lists `LICENSE-MIT`. `README.md` will still be absent at this point — that is expected, because `Iteration: Update Knowledge` creates it.
- `$PROJECT/libs/config/node_modules` is absent.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/config/`.
- Stage **everything** — Part B's changes plus the five Part A files already staged — and commit with the blueprint message below. This commit carries policy `AUTONOMOUS`.

```text
refactor(config): Restructure src into domain modules and complete package metadata.

- Move the four public modules into domain dirs and drop dead cache re-exports.
- Complete the package metadata that `libs/fs-records` already carries.
- Include the staged conventions changes and the esbuild `0.28.2` pin.
```

**Dependencies:**

- Iteration: Apply Noodlestan Conventions — its changes are staged and are committed together with this iteration.

#### Commits:

| ID                   | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| -------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `restructure-config` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `8f2d84e` | `COMMITTED` |

##### Commit: `restructure-config`

**Message:**

```text
refactor(config): Restructure src into domain modules and complete package metadata.

- Move the four public modules into domain dirs and drop dead cache re-exports.
- Complete the package metadata that `libs/fs-records` already carries.
- Include the staged conventions changes and the esbuild `0.28.2` pin.
```

**Hash:** `8f2d84e` — pushed to `origin/main` (`92619ad..8f2d84e`). Carries both Part B and the five Part A files staged by `Iteration: Apply Noodlestan Conventions`.

**Status:** `COMMITTED`

### Iteration: Update Knowledge

**Id:** `update-knowledge`

**Status:** `DONE`

**Purpose:** Publish the package knowledge base and wire `@art-lib/config` into the repository artefacts.

**Description:** Add a package knowledge base, correct the package guide against the post-restructure layout, and update the repository knowledge, project record, and guide to list the package and link its knowledge. Commit as `docs(config): Add package knowledge base and repository references.`

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

- `$PROJECT/libs/config/README.md` — **already delivered, leave it as written** (commit `3f3a975`). It covers `loadConfigModule`, its four options, and the piecewise `findReusableBundle` → `compileConfig` → `importConfigModule` pipeline. Do not regenerate or overwrite it; your validation step below still checks it is self-sufficient.
- `$PROJECT/libs/config/knowledge/` — package knowledge base following `$WORKSPACE/checkouts/art-md/cli/bin/knowledge`: at least `index.md`, `overview.md`, and `design/config.md`; add `adr/` records where decisions exist.
- `$PROJECT/libs/config/_guide.md` — reference the local knowledge base (`knowledge/index.md`), **and correct the `## Package Layout` `src/` tree to the current domain layout**: `compile/`, `load/`, `module/`, `cache/`, `private/`, plus `index.ts` and `types.ts` at the root. The flat tree it currently shows (`cache.ts`, `compileConfig.ts`, `importConfigModule.ts`, `loadConfigModule.ts`) predates `Iteration: Restructure Config Package` and is stale. Also update its Knowledge References if it names paths that have moved.
- `$PROJECT/knowledge/components.md` — move the Config entry to `IMPLEMENTED` and link its package knowledge.
- `$PROJECT/knowledge/index.md` — add a Package Knowledge References row linking `libs/config/knowledge/index.md` (see `$WORKSPACE/checkouts/art-md/knowledge/index.md`). This repository's index has no such section yet — create it alongside the existing Documents, Design Documents, and Decision Records sections.
- `$PROJECT/_records/project.art` — add `- Package: Art Lib Config` to Resources.
- `$PROJECT/_guide.md` — list the package under the repository layout and its knowledge base under Knowledge References.
- Keep `$PROJECT/knowledge/design/config.md` as the repository-level design record.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.
- Read `$PROJECT/knowledge/design/config.md` and preserve its package boundaries and loading/cache contracts.

Validate that:

- The package knowledge links resolve and the README `## Usage` is self-sufficient for a new consumer.
- The package guide's `## Package Layout` tree matches the actual `src/` domain layout — no flat-tree entries (`cache.ts`, `compileConfig.ts`, `loadConfigModule.ts`, `importConfigModule.ts` at the root) remain.
- Every repository reference lists the package: `knowledge/index.md`, `knowledge/components.md`, `_records/project.art`, `_guide.md`.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/config/`.
- Commit `update-knowledge-config` with the blueprint message below.

```text
docs(config): Add package knowledge base and repository references.

- Create the package knowledge base and correct the guide's post-restructure layout.
- Link the package knowledge from the repository knowledge index and records.
```

**Dependencies:**

- Iteration: Restructure Config Package — README and `knowledge/` document the final source layout and package metadata, so the restructure must land first.

#### Commits:

| ID                        | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ------------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `update-knowledge-config` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `21da36b` | `COMMITTED` |

##### Commit: `update-knowledge-config`

**Message:**

```text
docs(config): Add package knowledge base and repository references.

- Create the package knowledge base and correct the guide's post-restructure layout.
- Link the package knowledge from the repository knowledge index and records.
```

**Hash:** `21da36b` — pushed to `origin/main` (`f7c453f..21da36b`).

**Status:** `COMMITTED`

### Iteration: Publish Config Package

**Id:** `publish-config-package`

**Status:** `READY`

**Purpose:** Publish `@art-lib/config@0.0.1` to the public registry and record the deployment, lifting `Integrate in Consumer`'s gate.

**Description:** Publish the first version and flip both records to their deployed state. No version bump and no CHANGELOG edit are needed — this is the first publish, `version` is already `0.0.1`, and `CHANGELOG.md` already documents `## 0.0.1`. The release commit therefore carries only the record updates, the same shape as `release(fs-records): 0.0.3`, which carried the state change rather than code.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

1. Verify every publish precondition **before** touching the registry. Any failure is a `REPORT A BLOCKER`, not something to work around:
   - `npm whoami` returns an account permitted to publish `@art-lib/*` (currently `noodlestan`).
   - `npm view @art-lib/config version` fails with `ENOTFOUND` — `0.0.1` must not already exist. A published version is immutable, so a mistake requires a bump and a new publish.
   - `$PACKAGE/package.json` carries `version` `0.0.1`, `private` `false`, `publishConfig` `{ "access": "public" }`, and `files` listing `dist`, `README.md`, `LICENSE-MIT`, `CHANGELOG.md`.
   - All four `files` entries exist on disk, and the manifest conforms to `$WORKSPACE/checkouts/management/_ops/packages/policy.md`.
2. `npm pack --dry-run` from `$PACKAGE`, and confirm the tarball contains `package.json`, `dist/index.mjs`, `dist/index.d.ts`, `README.md`, `LICENSE-MIT`, and `CHANGELOG.md`.
3. `npm publish --access public` from `$PACKAGE`. If the registry demands a one-time password for two-factor authentication, **do not retry and do not unpublish** — `REPORT A BLOCKER` that publishing requires an OTP and stop.
4. Confirm the publish landed: `npm view @art-lib/config version` returns `0.0.1`, `npm view @art-lib/config dependencies` shows `esbuild` pinned `0.28.2`, and the description and keywords match the record.
5. Update both records to the deployed state:
   - `$PROJECT/libs/config/_records/package.art` — `**Published:**` from `false` to `true`.
   - `$PROJECT/libs/config/_records/npm-deployment.art` — `**Status:**` from `PLANNED` to `DEPLOYED`.
6. Do not change `version` or `CHANGELOG.md`.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above.

**This iteration publishes a public and immutable artefact.** Treat the step-1 preconditions as hard stops: if any fails, `REPORT A BLOCKER` and do not attempt a workaround. Never unpublish.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.
- Read `$WORKSPACE/checkouts/management/_ops/packages/policy.md` — the manifest must already conform before it ships.

Validate that:

- The registry serves `@art-lib/config@0.0.1` with the expected `description`, `keywords`, `engines`, and `dependencies`.
- Both records reflect the deployed state: `_records/package.art` `Published` `true`, `_records/npm-deployment.art` `Status` `DEPLOYED`.
- `version` and `CHANGELOG.md` are untouched.
- `npm run ci` still passes from the `$WORKSPACE` root.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/config/`.
- Commit `publish-config` with the blueprint message below.

```text
release(config): Publish 0.0.1 to npm.

- Record the first publish: `Published` true, deployment `DEPLOYED`.
```

**Dependencies:**

- Iteration: Update Knowledge — the published package must ship the README its registry listing and consumers reference.

#### Commits:

| ID               | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| ---------------- | ------------------------------ | ------------ | ------- | ---------- |
| `publish-config` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `publish-config`

**Message:**

```text
release(config): Publish 0.0.1 to npm.

- Record the first publish: `Published` true, deployment `DEPLOYED`.
```

### Iteration: Integrate in Consumer

**Id:** `integrate-in-consumer`

**Status:** `READY`

**Purpose:** Adopt `@art-lib/config` in the Art Workspace Cli and retire its duplicated implementation.

**Description:** Refactor `$ART_WORKS/cli/workspace` to consume `@art-lib/config`, keeping CLI-specific conventions on the CLI side. Commit in the Art Works repository as `refactor(workspace-cli): Adopt @art-lib/config in the Workspace Cli.`

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$ART_WORKS` (Art Works repository checkout)

- `cli/workspace/package.json` — declare `@art-lib/config` the way `@art-lib/fs-records` is declared.
- `cli/workspace/src/config/loadWorkspaceConfig.ts` — load through `loadConfigModule` from `@art-lib/config`; keep `defineConfig`, the config types, and the `node_modules/.art-workspace/` cache conventions on the CLI side.
- `cli/workspace/src/config/private/` — delete the superseded compile/cache/import modules and their tests.
- `cli/workspace/src/index.ts` and the `./config` export — rewire the public surface to the adopted loader.
- Rewire callers and test helpers; keep the CLI behaviour identical.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

**GATE — do not start until the package is consumable:** `Iteration: Publish Config Package` must be `DONE` and `@art-lib/config@0.0.1` must be installable from the Art Works checkout; verify it exposes the documented API before proceeding. The preceding iterations are a prerequisite only insofar as they produced what was published. This consumer-integration iteration is deliberately excluded from the gate. If the package is not yet available or the API is missing, REPORT A BLOCKER with "config package not published/consumable yet" and STOP.

Execute the Changes listed above, keeping the CLI behaviour identical.

Before starting:

- Run `npm ci` from `$ART_WORKS`.
- Read `$PROJECT/knowledge/design/config.md` and preserve its consumer/package boundary and API contracts.

Validate that:

- `npm run ci` passes from `$ART_WORKS/cli/workspace`.
- The CLI behaviour is unchanged: the same inputs produce the same outputs.

After executing:

- Commit `integrate-config-in-consumer` in the Art Works repository with the blueprint message below.

```text
refactor(workspace-cli): Adopt @art-lib/config in the Workspace Cli.

- Replace the local config loading pipeline with @art-lib/config.
- Keep CLI behaviour and its test suite green.
```

**Dependencies:**

- Iteration: Publish Config Package — the Art Works checkout installs the published version, so publishing is the direct prerequisite.

#### Commits:

| ID                             | Repository / Checkout / Branch    | Policy       | Hash    | Status     |
| ------------------------------ | --------------------------------- | ------------ | ------- | ---------- |
| `integrate-config-in-consumer` | Art Works / `$ART_WORKS` / `main` | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `integrate-config-in-consumer`

**Message:**

```text
refactor(workspace-cli): Adopt @art-lib/config in the Workspace Cli.

- Replace the local config loading pipeline with @art-lib/config.
- Keep CLI behaviour and its test suite green.
```

---

## Coordination

### Not In Scope

- **Config schema and discovery rules** — each consumer CLI defines its own config shape and manifest name conventions on top of `loadConfigModule()`.
- **Consumer adoption beyond Art Works** — `@art-works/workspace-cli` is the first consumer (Iteration: Integrate in Consumer); other CLIs migrate in their own projects.

### Evidence

- **Scaffold iteration completed (2026-10-31).** `libs/config/` created (8 files) mirroring `libs/fs-records`; package, repo, and workspace `npm run ci` all green, pre-commit hooks passed. Commit `ef23a68` pushed to `origin/main`. See `./plan-add-config/instructions/scaffold-config-package__report.md`.
- The worker correctly refused to run `npm install` inside `$PROJECT`, per the plan's Setting Up instructions.
- **Config loading iteration completed (2026-11-01).** 9 source files in `libs/config/src/` (`types`, `compileConfig`, `importConfigModule`, `loadConfigModule`, 4 `private/` helpers, tests); 6/6 tests green, coverage 97.95/88.88/100/100. Commit `b5de21e` pushed to `origin/main`. See `./plan-add-config/instructions/implement-config-loading__report.md`.
- **Verified non-blocking:** `libs/config/.prettierignore` was never scaffolded (both repo root and `libs/fs-records` carry one), so a bare `npm run lint` fails on `dist/`. The full Verifying Completion sequence still passes 4/4 because `lint:fix` runs first and `dist/` is gitignored (`**/dist`). Resolved by `Iteration: Apply Noodlestan Conventions`. Recorded as a follow-up, not a blocker.
- **Restructure iteration completed (2026-11-01).** `src/` split into `compile/` (5), `cache/` (7), `load/` (2), `module/` (1) with only the three cross-domain helpers — `constants`, `resolveConfigBaseDir`, `hashConfigInputPaths` — left in `private/`. All moves via `git mv`. `cache.ts` renamed to `cache/findReusableBundle.ts` with both dead re-exports deleted. Metadata completed: `LICENSE-MIT`, `CHANGELOG.md`, `.npmignore`, `_records/npm-deployment.art` (`PLANNED`), `sideEffects: false`, `engines: node >=22`. Commit `8f2d84e` pushed to `origin/main`, carrying Part A's five staged files as well.
- **Public API verified unchanged:** all 8 symbols (`loadConfigModule`, `compileConfig`, `importConfigModule`, `findReusableBundle`, and the four types) resolve from `src/index.ts` and in the built `dist/index.d.ts`; 16/16 tests pass; no re-export chain remains outside `index.ts`; no file declares more than one exported function. `npm pack --dry-run` now lists `LICENSE-MIT` (`README.md` correctly still absent — owned by `Update Knowledge`).
- **README delivered separately (2026-11-01).** `libs/config/README.md` — written against the package's own API and type-checked against the built `dist` surface, not copied from `libs/fs-records`. Ships in the tarball (`3f3a975`); `CHANGELOG.md` was added to `files` and `_records/package.art` in `ac46bdb` after it transpired the restructure spec had omitted that. Both were pre-empting `Update Knowledge`, which therefore executed only its remaining changes.
- **Update Knowledge iteration completed (2026-11-01).** `libs/config/knowledge/{index,overview,design/config,adr/config}.md` created (5 decisions recorded); `_guide.md`'s stale flat `src/` tree corrected to the domain layout with no flat entries remaining; repo wiring complete — new `Package Knowledge References` section in `knowledge/index.md`, Config moved to `IMPLEMENTED` in `knowledge/components.md`, `Package: Art Lib Config` added to `_records/project.art`, and both the layout and knowledge references added to `$PROJECT/_guide.md`. `README.md` validated and left untouched. Commit `21da36b` pushed to `origin/main`.
- **Config cache iteration completed (2026-11-01).** `cache.ts` (`findReusableBundle`) plus 9 private helpers, cache reuse/bypass/degradation wired into `loadConfigModule`; 16/16 tests green, coverage 97/92.85/100/100. Commit `92619ad` pushed to `origin/main`. See `./plan-add-config/instructions/implement-config-cache__report.md`.
- **Acceptance criteria met:** `@art-lib/config` builds, lints, and tests green from `$PROJECT/libs/config`; a second `loadConfigModule()` call with an unchanged fixture and a valid `cacheDir` skips the esbuild build; `cache: false` forces a rebuild. Both behaviours are covered by tests, so the bullet previously listed as pending is now delivered.

### Findings

- Art Works already implements esbuild bundle-at-runtime loading and is mid-flight adding a content-hash cache (`plan-add-config-cache` in `$ART_WORKS`) — its design and decisions (cache under `node_modules/`, content hash over mtime, graceful degradation, bypass refreshes the cache) are the proven basis for this package.

### Decisions

- **`writeConfigBundle` and `createConfigCacheMeta` sit in `compile/`, not `cache/`.** The placement rule is mechanical — a helper goes beside the single module that calls it — and `compileConfig` is their only caller, so the import graph says `compile/`. Semantically they are the cache _write_ half and pair with `cache/`'s read half; the shared `src/private/constants.ts` is the cache-format contract between the two sides. Recorded because the semantic reading was considered and the mechanical one chosen. _2026-11-01._

- **No conventions in the package** — config entry path, cache directory, and config shape are caller parameters; the workspace CLI keeps `.art-workspace.mts`, `node_modules/.art-workspace/`, and `defineConfig` on its side.
- **Content hash (sha256 of every esbuild `metafile.inputs` entry), not mtime** — mtimes are unreliable across checkouts and container binds; input paths are recorded relative to `baseDir`.
- **Degrade gracefully** — an unwritable cache falls back to a temp-dir bundle with a warning; caching never fails the run.
- **Bypass refreshes the cache** — `cache: false` rebuilds and rewrites the metadata so the next run is warm.

### Knowledge to Update

- Keep the `config` package entry in `knowledge/components.md` in sync after scaffolding.

### Follow Ups

- `@art-works/workspace-cli` adoption is planned here (Iteration: Integrate in Consumer); `plan-art-work-cli-global-install` remains tracked in `$ART_WORKS`.
- ~~Refresh `package-lock.json` once `libs/config` has real dependencies.~~ — **resolved 2026-11-01.** The esbuild `0.28.2` pin refreshed the lockfile; `libs/config` now appears in its `packages` map alongside `libs/fs-records`, `npm ls` resolves both workspaces, and the turbo warning is gone. The original concern — that `npm ci` inside `$PROJECT` would fail its sync check — no longer applies.
- ~~Add `libs/config/.prettierignore`~~ — **resolved by `Iteration: Apply Noodlestan Conventions`** (`8f2d84e`): `.coverage/`, `coverage/`, `env.d.ts`, `dist/`, mirroring the repo root and `libs/fs-records`. A bare `npm run lint` from `$PACKAGE` now passes on a built tree.
- ~~`libs/config/_guide.md` still describes `src/` as a placeholder `index.ts`~~ — **resolved across two iterations**: the flat tree was corrected by `Apply Noodlestan Conventions`, then `Update Knowledge` re-corrected it to the post-restructure **domain** layout (`compile/`, `load/`, `module/`, `cache/`, `private/`) after the restructure superseded it again. Verified 2026-11-01: no flat entries remain.
- ~~Manifest does not conform to `$WORKSPACE/checkouts/management/_ops/packages/policy.md`.~~ — **resolved 2026-11-01.** `repository` (https endpoint, repo-relative `directory`) and `publishConfig` `{ "access": "public" }` added in policy order. All three packages now report no missing fields and correct key order.
- ~~`keywords` are not ratified in the matrix.~~ — **resolved 2026-11-01 — and the original reading was wrong.** The matrix model is: a row carries the package's **own** keywords only, while the record and manifest carry the **composed** set (own first, then the project's `art, terminal-apps`, deduplicated). Config's record and manifest were already byte-identical composed sets, so `cli, tooling` were config's _own_ keywords — legitimate for a CLI-serving library, exactly as `fs-records` carries them — not copied project keywords. Nothing was wrong with the values; the only gap was the missing row, now added to `_ops/keywords/matrix.md`.
- **The pre-commit hook recreates `libs/config/node_modules/.vite`** (vitest's ~8 KB cache directory) on every `turbo ci` run. It holds no dependencies — the esbuild-shadowing root cause is gone with the `0.28.2` pin — so this is cosmetic, but it means the iteration's "`node_modules` is absent" check only holds immediately after someone removes it. `node_modules/` is gitignored, so it never dirties the tree. Accepted for now; revisit if a real dependency ever nests there again. _Surfaced by the restructure worker, 2026-11-01._

### Feedback

- None.
