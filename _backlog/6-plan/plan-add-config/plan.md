# Plan: Add Config Package

**ID:** `add-config`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Load, compile, and cache typed config modules (for example, `something.config.mts`).

**Description:** Create the `@art-lib/config` package: `loadConfigModule<T>(entryPath, options?)` — esbuild bundle-at-runtime compilation of a caller-supplied config entry, an optional content-hash cache in a caller-supplied `cacheDir`, a `cache: false` bypass that refreshes the cache, and graceful degradation when the cache is unwritable. The package assumes nothing about config location, cache location, or config data shape.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                           | Purpose                               |
| ------------ | --------------------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory               | Workspace root directory              |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains`            | Domain resources directory            |
| `$PROJECT`   | `$WORKSPACE/checkouts/art-lib-planning` | Planning repository (upstream items). |
| `$ART_LIB`   | `$WORKSPACE/checkouts/art-lib-building` | Art Lib repository.                   |

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

::READ `architecture/design/config.md` (Design) — Consumer requirements from the Art Work CLI and its config-cache plan. Relevant for Planning Work Item.

::READ `$ART_LIB/architecture/index.md` (Model) — Package layout and publishing conventions. Relevant for Planning Work Item.

## Scope

Create `$ART_LIB/libs/config` exposing `loadConfigModule`, the lower-level `compileConfig` / `findReusableBundle` / `importConfigModule` pieces, and the cache metadata types — with esbuild bundle-at-runtime compilation, a caller-supplied cache directory, and a bypass option — plus tests, package records, and docs mirroring `libs/fs-records` conventions. Config location, cache location, defaults, and schema stay with each consumer CLI.

## Work

### Next

- Write instructions for the three `PLANNING` iterations, then delegate Iteration: Scaffold Config Package.

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

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$ART_LIB` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.

2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

**Instructions:** (From `$ART_LIB/_guide.md`)

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

| Iteration / Instructions            | Status     |
| ----------------------------------- | ---------- |
| Iteration: Scaffold Config Package  | `PLANNING` |
| Iteration: Implement Config Loading | `PLANNING` |
| Iteration: Implement Config Cache   | `PLANNING` |

### Iteration: Scaffold Config Package

**Id:** `scaffold-config-package`

**Status:** `PLANNING`

**Purpose:** Create the `config` package skeleton before adding modules.

**Description:** Scaffold `$ART_LIB/libs/config` mirroring `libs/fs-records` conventions: `package.json` (root export; runtime dependency on `esbuild`), tsconfig, vitest config, npm scripts, `_guide.md`, `_records/package.art`, `src/index.ts` placeholder.

**Changes:**

In `$ART_LIB/libs/config`

- Create `package.json` — name `@art-lib/config`, root export, runtime dependency `esbuild`, scripts mirroring `libs/fs-records`.
- Create `tsconfig.json` and vitest config extending the monorepo configs.
- Create `src/index.ts` as placeholder entry point.
- Create `_guide.md` describing the package and operating instructions.
- Create `_records/package.art` mirroring `libs/fs-records/_records`.

**Dependencies:**

- None.

#### Commits:

| ID                | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| ----------------- | --------------------------------- | ------------ | ---- | ---------- |
| `scaffold-config` | Art Lib / `$ART_LIB` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `scaffold-config`

**Message:**

```text
scaffold(config): Scaffold package skeleton.
```

### Iteration: Implement Config Loading

**Id:** `implement-config-loading`

**Status:** `PLANNING`

**Purpose:** Implement typed config authoring and esbuild bundle-at-runtime loading.

**Description:** Implement `src/` with `loadConfigModule<T>(entryPath, options?)` and the pieces beneath it: `compileConfig(entryPath, options)` (esbuild `bundle-at-runtime` with `metafile: true`; externals = package defaults merged with caller `externals`), `importConfigModule<T>(bundlePath)` (dynamic import, default export). Without a `cacheDir`, compile to a temp `.mjs` and import; with one, write bundle + metadata there. Unit tests.

**Changes:**

In `$ART_LIB/libs/config/src/`

- `types.ts` — `LoadConfigOptions { cacheDir?, cache?, baseDir?, externals? }`, `CompiledConfig`, `ConfigCacheInput`, `ConfigCacheMeta`.
- `compileConfig.ts` — esbuild bundle-at-runtime with default externals (node builtins + `esbuild`) merged with caller `externals`; writes bundle + metadata when `cacheDir` is given; temp-dir fallback on write failure.
- `importConfigModule.ts` — `import(pathToFileURL(bundlePath))`; returns the default export as `T`.
- `loadConfigModule.ts` — orchestrates compile-or-reuse (cache lands next iteration) → import.
- `loadConfigModule.test.ts` — loads a fixture config entry from a caller-supplied path; resolves imports from the consumer `node_modules`; throws a clear error when the entry is missing; works without a `cacheDir` (temp bundle).
- Update `src/index.ts` exports.

**Dependencies:**

- Iteration: Scaffold Config Package.

#### Commits:

| ID                   | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| -------------------- | --------------------------------- | ------------ | ---- | ---------- |
| `add-config-loading` | Art Lib / `$ART_LIB` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `add-config-loading`

**Message:**

```text
build(config): Add typed config loading with bundle-at-runtime.
```

### Iteration: Implement Config Cache

**Id:** `implement-config-cache`

**Status:** `PLANNING`

**Purpose:** Reuse the compiled config while its sources are unchanged; bypass on demand.

**Description:** Add the content-hash cache inside the caller-supplied `cacheDir` (`config.bundle.mjs` + `config.cache.json` with a sha256 per esbuild `metafile.inputs` entry, recorded relative to `baseDir`, and a `version` field). Reuse the cached bundle only while every recorded input hashes the same; changed/missing/unreadable input, missing bundle, unparseable metadata, or version mismatch triggers a rebuild. Unwritable cache degrades to a temp bundle with a warning — never fails the run. `options.cache === false` bypasses reuse, rebuilds, and refreshes the cache. Unit tests.

**Changes:**

In `$ART_LIB/libs/config/src/`

- `cache.ts` — `findReusableBundle(cacheDir, baseDir)`, metadata read/write with version and shape guards, input-hash verification (sha256, content-based).
- `loadConfigModule.ts` — integrate cache check before `build()`; `metafile: true`; bypass via `options.cache === false` (still refreshes).
- `loadConfigModule.test.ts` — valid cache skips rebuild; edited source rebuilds; imported-file change rebuilds; missing/unparseable/version-mismatch rebuilds; unwritable cache degrades to temp; bypass rebuilds and refreshes.
- Update `src/index.ts` exports.

**Dependencies:**

- Iteration: Implement Config Loading.

#### Commits:

| ID                 | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| ------------------ | --------------------------------- | ------------ | ---- | ---------- |
| `add-config-cache` | Art Lib / `$ART_LIB` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `add-config-cache`

**Message:**

```text
build(config): Add content-hash config cache with bypass.
```

---

## Coordination

### Not In Scope

- **Config schema and discovery rules** — each consumer CLI defines its own config shape and manifest name conventions on top of `loadConfig()`.
- **Adoption refactors** — `@art-work/cli` migrates its local config loader in its own project.

### Evidence

- `@art-lib/config` builds, lints, and tests green from `$ART_LIB/config`; a second `loadConfigModule()` call with an unchanged fixture and a valid `cacheDir` skips the esbuild build; `cache: false` forces a rebuild.

### Findings

- Art Work already implements esbuild bundle-at-runtime loading and is mid-flight adding a content-hash cache (`plan-add-config-cache` in `$ART_WORK`) — its design and decisions (cache under `node_modules/`, content hash over mtime, graceful degradation, bypass refreshes the cache) are the proven basis for this package.

### Decisions

- **No conventions in the package** — config entry path, cache directory, and config shape are caller parameters; art-work keeps `.art-workspace.mts`, `node_modules/.art-work/`, and `defineConfig` on its side.
- **Content hash (sha256 of every esbuild `metafile.inputs` entry), not mtime** — mtimes are unreliable across checkouts and container binds; input paths are recorded relative to `baseDir`.
- **Degrade gracefully** — an unwritable cache falls back to a temp-dir bundle with a warning; caching never fails the run.
- **Bypass refreshes the cache** — `cache: false` rebuilds and rewrites the metadata so the next run is warm.

### Knowledge to Update

- Keep the `config` package entry in `architecture/components.md` in sync after scaffolding.

### Follow Ups

- `@art-work/cli` adopts `@art-lib/config`, retiring `cli/work/src/config/` (tracked there: `plan-add-config-cache`, `plan-art-work-cli-global-install`).

### Feedback

- None.
