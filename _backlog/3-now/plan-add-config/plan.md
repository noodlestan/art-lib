# Plan: Add Config Package

**ID:** `add-config`

**Status:** `READY`

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

- Planning complete: all six iterations are `READY` with instructions. Delegate Iteration: Scaffold Config Package, the two implementation iterations, Iteration: Apply Noodlestan Conventions (`MANUAL` commit), Iteration: Update Knowledge, then Iteration: Integrate in Consumer. Independent of Logger and Operations — may proceed in parallel with Plan: Add Logger Package.

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
| Iteration: Scaffold Config Package      | `READY` |
| Iteration: Implement Config Loading     | `READY` |
| Iteration: Implement Config Cache       | `READY` |
| Iteration: Apply Noodlestan Conventions | `READY` |
| Iteration: Update Knowledge             | `READY` |
| Iteration: Integrate in Consumer        | `READY` |

### Iteration: Scaffold Config Package

**Id:** `scaffold-config-package`

**Status:** `READY`

**Purpose:** Create the `config` package skeleton before adding modules.

**Description:** Scaffold `$PROJECT/libs/config` mirroring `libs/fs-records` conventions: `package.json` (root export; runtime dependency on `esbuild`), tsconfig, vitest config, npm scripts, `_guide.md`, `_records/package.art`, `src/index.ts` placeholder.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/scaffold-config-package.md`

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

| ID                | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| ----------------- | ------------------------------ | ------------ | ------- | ---------- |
| `scaffold-config` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `scaffold-config`

**Message:**

```text
scaffold(config): Scaffold package skeleton.

- Create manifest, tsconfig, vitest config, and scripts mirroring `libs/fs-records`.
- Add `_guide.md` and `_records/package.art`.
```

### Iteration: Implement Config Loading

**Id:** `implement-config-loading`

**Status:** `READY`

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/implement-config-loading.md`

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

| ID                   | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| -------------------- | ------------------------------ | ------------ | ------- | ---------- |
| `add-config-loading` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `add-config-loading`

**Message:**

```text
build(config): Add typed config loading with bundle-at-runtime.

- Add `compileConfig`, `importConfigModule`, and the `loadConfigModule` orchestrator.
- Cover fixture loading, missing entry, and temp-bundle paths with tests.
```

### Iteration: Implement Config Cache

**Id:** `implement-config-cache`

**Status:** `READY`

**Purpose:** Reuse the compiled config while its sources are unchanged; bypass on demand.

**Description:** Add the content-hash cache inside the caller-supplied `cacheDir` (`config.bundle.mjs` + `config.cache.json` with a sha256 per esbuild `metafile.inputs` entry, recorded relative to `baseDir`, and a `version` field). Reuse the cached bundle only while every recorded input hashes the same; changed/missing/unreadable input, missing bundle, unparseable metadata, or version mismatch triggers a rebuild. Unwritable cache degrades to a temp bundle with a warning — never fails the run. `options.cache === false` bypasses reuse, rebuilds, and refreshes the cache. Unit tests.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/implement-config-cache.md`

**Changes:**

In `$PROJECT/libs/config/src/`

- `cache.ts` — `findReusableBundle(cacheDir, baseDir)`, metadata read/write with version and shape guards, input-hash verification (sha256, content-based).
- `loadConfigModule.ts` — integrate cache check before `build()`; `metafile: true`; bypass via `options.cache === false` (still refreshes).
- `loadConfigModule.test.ts` — valid cache skips rebuild; edited source rebuilds; imported-file change rebuilds; missing/unparseable/version-mismatch rebuilds; unwritable cache degrades to temp; bypass rebuilds and refreshes.
- Update `src/index.ts` exports.

**Dependencies:**

- Iteration: Implement Config Loading.

#### Commits:

| ID                 | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| ------------------ | ------------------------------ | ------------ | ------- | ---------- |
| `add-config-cache` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `add-config-cache`

**Message:**

```text
build(config): Add content-hash config cache with bypass.

- Reuse the cached bundle only while every recorded input hash matches.
- Degrade to a temp bundle when the cache is unwritable; `cache: false` refreshes.
```

### Iteration: Apply Noodlestan Conventions

**Id:** `apply-noodlestan-conventions`

**Status:** `READY`

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

| ID                         | Repository / Checkout / Branch | Policy   | Hash    | Status     |
| -------------------------- | ------------------------------ | -------- | ------- | ---------- |
| `apply-conventions-config` | Art Lib / `$PROJECT` / `main`  | `MANUAL` | `(TBD)` | `AUTHORED` |

##### Commit: `apply-conventions-config`

**Message:**

```text
style(config): Apply Noodlestan conventions.

- Adopt the conventions that apply to the package and resolve audit findings.
```

### Iteration: Update Knowledge

**Id:** `update-knowledge`

**Status:** `READY`

**Purpose:** Publish the package knowledge base and wire `@art-lib/config` into the repository artefacts.

**Description:** Add a consumer-facing README and a package knowledge base, then update the repository knowledge, project record, and guide to list the package and link its knowledge. Commit as `docs(config): Add package knowledge base and README usage.`

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

- `$PROJECT/libs/config/README.md` — consumer-facing `## Usage` following the pattern of `$WORKSPACE/checkouts/workspace-tooling/cli/esbuild-cli/README.md`: what it is, install, configure, example, options.
- `$PROJECT/libs/config/knowledge/` — package knowledge base following `$WORKSPACE/checkouts/art-md-planning/cli/bin/knowledge`: at least `index.md`, `overview.md`, and `design/config.md`; add `adr/` records where decisions exist.
- `$PROJECT/libs/config/_guide.md` — reference the local knowledge base (`knowledge/index.md`).
- `$PROJECT/knowledge/components.md` — move the Config entry to `IMPLEMENTED` and link its package knowledge.
- `$PROJECT/knowledge/index.md` — add a Package Knowledge References row linking `libs/config/knowledge/index.md` (see `$WORKSPACE/checkouts/art-md-planning/knowledge/index.md`).
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
- Every repository reference lists the package: `knowledge/index.md`, `knowledge/components.md`, `_records/project.art`, `_guide.md`.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/config/`.
- Commit `update-knowledge-config` with the blueprint message below.

```text
docs(config): Add package knowledge base and README usage.

- Add the package knowledge base, a consumer-facing README, and repository references.
- Link the package knowledge from the repository knowledge index.
```

**Dependencies:**

- Iteration: Apply Noodlestan Conventions.

#### Commits:

| ID                        | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| ------------------------- | ------------------------------ | ------------ | ------- | ---------- |
| `update-knowledge-config` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `update-knowledge-config`

**Message:**

```text
docs(config): Add package knowledge base and README usage.

- Add the package knowledge base, a consumer-facing README, and repository references.
- Link the package knowledge from the repository knowledge index.
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

**GATE — do not start until the package is consumable:** Iterations `Scaffold Config Package`, `Implement Config Loading`, `Implement Config Cache`, `Apply Noodlestan Conventions` (including its MANUAL commit), and `Update Knowledge` must be complete. The resulting `@art-lib/config` package version must be published to npm (or the agreed package registry) and installable from the Art Works checkout; verify it exposes the documented API before proceeding. This consumer-integration iteration is deliberately excluded from the gate. If the package is not yet available or the API is missing, REPORT A BLOCKER with "config package not published/consumable yet" and STOP.

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

- Iteration: Update Knowledge.

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

- `@art-lib/config` builds, lints, and tests green from `$PROJECT/libs/config`; a second `loadConfigModule()` call with an unchanged fixture and a valid `cacheDir` skips the esbuild build; `cache: false` forces a rebuild.

### Findings

- Art Works already implements esbuild bundle-at-runtime loading and is mid-flight adding a content-hash cache (`plan-add-config-cache` in `$ART_WORKS`) — its design and decisions (cache under `node_modules/`, content hash over mtime, graceful degradation, bypass refreshes the cache) are the proven basis for this package.

### Decisions

- **No conventions in the package** — config entry path, cache directory, and config shape are caller parameters; the workspace CLI keeps `.art-workspace.mts`, `node_modules/.art-workspace/`, and `defineConfig` on its side.
- **Content hash (sha256 of every esbuild `metafile.inputs` entry), not mtime** — mtimes are unreliable across checkouts and container binds; input paths are recorded relative to `baseDir`.
- **Degrade gracefully** — an unwritable cache falls back to a temp-dir bundle with a warning; caching never fails the run.
- **Bypass refreshes the cache** — `cache: false` rebuilds and rewrites the metadata so the next run is warm.

### Knowledge to Update

- Keep the `config` package entry in `knowledge/components.md` in sync after scaffolding.

### Follow Ups

- `@art-works/workspace-cli` adoption is planned here (Iteration: Integrate in Consumer); `plan-art-work-cli-global-install` remains tracked in `$ART_WORKS`.

### Feedback

- None.
