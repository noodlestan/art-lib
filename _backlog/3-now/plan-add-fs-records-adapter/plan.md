# Plan: Add FS Records Adapter

**ID:** `add-fs-records-adapter`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Provide a reusable implementation for discovering, reading and writing record files.

**Description:** Refactor existing modules to classify and separate responsibilities, and add the `FSRecordsAdapter` unit plus its per-file `FSContentSource`.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                | Purpose                                                                                               |
| ------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory                                                                              |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Domain resources directory                                                                            |
| `$PROJECT`   | Provided with Prompt         | This repository, where plan backlog, and all Art Lib implementation live. All code changes land here. |

## Summary

Provide a new service for finding, reading and writing records.

## Context

### Upstream Work

| Kind        | Path                                                         | Role                                                            |
| ----------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| Parking Lot | `$PROJECT/_backlog/_parking-lot.md`                          | Tracks short-term actionables, pending questions, and blockers. |
| Milestone   | `$PROJECT/_roadmap/3-now/milestone-art-lib-one/milestone.md` | Scope for this library's first version.                         |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$PROJECT/_guide.md` (Model) — Repository layout, records management, conventions, and operating instructions. Relevant for Planning Work Item.

::READ `$PROJECT/knowledge/components.md` (Model) — Package components and planned packages. Relevant for Planning Work Item.

## Scope

Refactor existing modules to classify and separate responsibilities, and add the `FSRecordsAdapter` unit plus its per-file `FSContentSource` — the filesystem discovery and content-acquisition backend for the records chain. Conforms to the agreed contracts in `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`: implements `ArtContentSource` (imported from `@art-md/primitives@0.0.3`), owns discovery + persistence only, no record semantics, no template rendering.

The adapter itself is not a content source — a content source addresses exactly one URI, and the adapter spans a search tree. `FSContentSource` is the `ArtContentSource` implementation (one per file); `FSRecordsAdapter` is discovery plus a content-source factory. This matches the `FSContentSource → ArtContentSource → ArtDocumentSource → ArtRecordCapsule` layering in the approved Art JS design.

## Work

### Next

- **ADVANCE** (2026-10-13, chain verdict). No longer held. Next move: delegate `Iteration: Refactor Module Layout` first (layout + renames, no records dependency), then the two adapter iterations. All three instruction files are current — see Blockers for the residual risk.

### Blockers

- None open. **Hold lifted 2026-10-13** — `ART_JS` (producer of the record-model symbols) confirmed the adapter is decoupled: it imports nothing from `@art-js/records`, `RecordPosition` never appears on its write path, and `ArtContentSource` belongs to `@art-md/primitives@0.0.3` (published). `ART_WORK` concurred. Release condition (1) — "`@art-js/records` green workspace-linked" — is **void**; the original 2026-10-11 rationale (WIP types duplicating records-domain abstractions) was retired when those types were deleted.
- **Residual risk, recorded not blocking** — the chain's agreed symbols (`discoverRecordFiles`, `FSRecordsPattern`, `FSRecordFile.basePath`) are **not yet in the published `@art-lib/fs-records@0.0.1`**, which still exports `findRecordFiles` / `FSRecordsPath` / `FSRecordsConfig` / `searchPath`. They land with iteration 1 of this plan. Any consumer runtime-verifying exports against `0.0.1` must expect the pre-rename names until this plan ships. Filed on the whiteboard 2026-10-13 against both `ART_JS`'s and `ART_WORK`'s critiques, which assumed otherwise.

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

Additionally verify that the package builds, lints, and tests green from `$PROJECT/libs/fs-records`, and that the two factories are exported from `index.ts`. All steps MUST pass. No `it.todo()` tests may remain.

---

## Items:

| Iteration / Instructions              | Status  |
| ------------------------------------- | ------- |
| Iteration: Refactor Module Layout     | `DONE`  |
| Iteration: Add FSRecordsAdapter Types | `READY` |
| Iteration: Implement FSRecordsAdapter | `READY` |

> All three iterations are `READY` — the plan-level hold was lifted 2026-10-13 (chain verdict: adapter decoupled from `@art-js/records`). `Refactor Module Layout` runs first: it owns the renames the other two iterations reference.

### Iteration: Refactor Module Layout

**Id:** `refactor-module-layout`

**Status:** `DONE`

**Description:** Move existing modules into `files/`, `discover/`, and `test/helpers/` directories. Rename `FSRecordsPath` to `FSRecordsPattern`, remove `FSRecordsConfig`, rename `findRecordFiles()` to `discoverRecordFiles()` accepting `(basePath, patterns)`, and rename `FSRecordFile.searchPath` to `FSRecordFile.basePath`.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./plan-add-fs-records-adapter/instructions/refactor-module-layout.md`

**Changes:**

In `$PROJECT/libs/fs-records`

Refactor modules to separate responsibilities:

- `src/readRecordFileContent.ts` → `src/files/readRecordFileContent.ts`
- type `FSRecordFile` moves to `src/files/types.ts`
- `src/findRecordFiles.ts` → `src/discover/discoverRecordFiles.ts` (function renamed `findRecordFiles` → `discoverRecordFiles`)
- `src/findRecordFiles.test.ts` → `src/discover/discoverRecordFiles.test.ts`

Refactor test helpers:

- `src/test/makeMockRecordsConfig.ts` → `src/test/helpers/config/makeMockRecordsConfig.ts`

Rename types and semantics:

- `FSRecordsPath` → `FSRecordsPattern` (same shape):

```ts
export interface FSRecordsPattern {
  base: string;
  pattern: string | string[];
  ignored: string[];
  excluded: string[];
  gitignore: boolean;
}
```

- Remove `FSRecordsConfig`; `discoverRecordFiles()` accepts `(basePath, patterns: FSRecordsPattern[], kinds?)`.
- Rename `FSRecordFile.searchPath` → `FSRecordFile.basePath`.
- Propagate `(basePath, pattern)` semantics to `findRecordFilesInPath()`, `globPath()`, `createRecordFile()`, and `getGitIgnoredSet()`.

Update all consumers within the package:

- `src/index.ts` exports.
- `src/private/filterByKinds.ts` imports.
- `src/test/helpers/config/makeMockRecordsConfig.ts`.
- `src/discover/discoverRecordFiles.test.ts`.

**Dependencies:**

- None.

#### Commits:

| ID                       | Repository / Checkout / Branch    | Policy       | Hash      | Status      |
| ------------------------ | --------------------------------- | ------------ | --------- | ----------- |
| `refactor-module-layout` | Art Lib / `$PROJECT` / `building` | `AUTONOMOUS` | `607b000` | `COMMITTED` |

##### Commit: `refactor-module-layout`

**Message:**

```text
refactor(fs-records): Reorganise module layout and rename FSRecordsPattern.
```

### Iteration: Add FSRecordsAdapter Types

**Id:** `add-adapter-types`

**Status:** `READY`

**Purpose:** Introduce the type layer for the adapter and its per-file content source, against the agreed chain contracts.

**Description:** Add `@art-md/primitives@0.0.3` as a dependency; create `files/FSContentSource.ts` implementing `ArtContentSource`; create `adapter/types.ts` with `FSRecordsAdapterOptions` and the `FSRecordsAdapter` interface. Export the new types from `index.ts`. No runtime behaviour — types only.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./plan-add-fs-records-adapter/instructions/add-adapter-types.md`

**Changes:**

In `$PROJECT/libs/fs-records/package.json`:

```json
"dependencies": {
  "@art-md/primitives": "0.0.3"
}
```

Pin exactly — `0.0.3` is published and frozen for this chain. Run `npm install` from `$WORKSPACE` root, never inside `$PROJECT`. Do **not** add `@art-md/constructs` — that is `@art-js/records`' dependency for the record bridge, not this adapter's.

In `libs/fs-records/src/files/FSContentSource.ts`:

```ts
import type { ArtContentSource } from '@art-md/primitives';

import type { FSRecordFile } from './types';

// One per file. Implements the chain's ArtContentSource contract: content
// acquisition and persistence only — no parsing, no record semantics.
export interface FSContentSource extends ArtContentSource {
  readonly type: 'fs';
  readonly file: FSRecordFile;
}
```

In `libs/fs-records/src/adapter/types.ts`:

```ts
import type { FSContentSource, FSRecordFile, FSRecordsPattern } from '../files/types';

export interface FSRecordsAdapterOptions {
  basePath: string;
  patterns: FSRecordsPattern[];
}

// The adapter is discovery + a content-source factory. It is NOT itself an
// ArtContentSource: a content source addresses one URI, the adapter spans a
// search tree.
export interface FSRecordsAdapter {
  readonly options: FSRecordsAdapterOptions;
  discoverRecordFiles(kinds?: string | string[]): Promise<FSRecordFile[]>;
  createContentSource(file: FSRecordFile): FSContentSource;
}
```

Update `libs/fs-records/src/index.ts` to export the new types. `ArtContentSource` is imported from `@art-md/primitives` and is **not** re-exported here — single source of truth for the contract (agreed import path).

**Dependencies:**

- Iteration: Refactor Module Layout.

#### Commits:

| ID                  | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| ------------------- | --------------------------------- | ------------ | ---- | ---------- |
| `add-adapter-types` | Art Lib / `$PROJECT` / `building` | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `add-adapter-types`

**Message:**

```text
build(fs-records): Add FSRecordsAdapter types and record abstractions.
```

### Iteration: Implement FSRecordsAdapter

**Id:** `implement-fs-records-adapter`

**Status:** `READY`

**Purpose:** Implement the `createFSRecordsAdapter` factory and the per-file `createFSContentSource`, wiring them to the existing discover/read/write utilities.

**Description:** Create `adapter/createFSRecordsAdapter.ts` (discovery + factory) and `files/createFSContentSource.ts` (the `ArtContentSource` implementation). `discoverRecordFiles()` maps to the existing free function; the content source wraps `readRecordFileContent()` and `writeFile()`. Add unit tests.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./plan-add-fs-records-adapter/instructions/implement-fs-records-adapter.md`

**Changes:**

In `libs/fs-records/src/files/createFSContentSource.ts`:

```ts
import { writeFile } from 'node:fs/promises';

import { readRecordFileContent } from './readRecordFileContent';
import type { FSContentSource } from './FSContentSource';
import type { FSRecordFile } from './types';

export function createFSContentSource(file: FSRecordFile): FSContentSource {
  let cached: string | undefined;

  const readContent = async (): Promise<string> => {
    if (cached !== undefined) return cached;
    const withContent = await readRecordFileContent(file);
    if (withContent.error !== undefined) throw withContent.error;
    if (withContent.content === undefined) {
      throw new Error(`No content for ${withContent.filename}`);
    }
    cached = withContent.content;
    return cached;
  };

  const writeContent = async (content: string): Promise<void> => {
    await writeFile(file.filename, content, 'utf-8');
    cached = content; // refresh so the next readContent() sees what we wrote
  };

  return {
    type: 'fs',
    file,
    get uri() {
      return `file://${file.filename}`;
    },
    get maybeContent() {
      return cached;
    },
    readContent,
    writeContent,
  };
}
```

In `libs/fs-records/src/adapter/createFSRecordsAdapter.ts`:

```ts
import { createFSContentSource } from '../files/createFSContentSource';
import { discoverRecordFiles } from '../discover/discoverRecordFiles';
import type { FSContentSource } from '../files/FSContentSource';
import type { FSRecordFile } from '../files/types';
import type { FSRecordsAdapter, FSRecordsAdapterOptions } from './types';

export function createFSRecordsAdapter(options: FSRecordsAdapterOptions): FSRecordsAdapter {
  const discoverRecordFilesForAdapter = async (kinds?: string | string[]) =>
    discoverRecordFiles(options.basePath, options.patterns, kinds ?? []);

  const createContentSource = (file: FSRecordFile): FSContentSource => createFSContentSource(file);

  return { options, discoverRecordFiles: discoverRecordFilesForAdapter, createContentSource };
}
```

Update `libs/fs-records/src/index.ts` to export `createFSRecordsAdapter` and `createFSContentSource`.

Add unit tests in `files/createFSContentSource.test.ts` (lazy `maybeContent`, `readContent` caches, `writeContent` persists and refreshes the cache, `uri` is `file://{filename}`) and `adapter/createFSRecordsAdapter.test.ts` (discovery honours patterns/kinds, `createContentSource` returns a working `FSContentSource`).

**Dependencies:**

- Iteration: Add FSRecordsAdapter Types.

#### Commits:

| ID                             | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| ------------------------------ | --------------------------------- | ------------ | ---- | ---------- |
| `implement-fs-records-adapter` | Art Lib / `$PROJECT` / `building` | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `implement-fs-records-adapter`

**Message:**

```text
build(fs-records): Implement FSRecordsAdapter factory and tests.
```

---

## Coordination

### Not In Scope

- None

### Evidence

- None

### Findings

- None

### Decisions

- **Degrade-not-fail lives at discovery, not at the content source (2026-10-13, settled).** `ArtContentSource.readContent()` is frozen upstream by `$ART_MD` at `Promise<string>` — it cannot return `undefined`, so it must throw for a genuinely unreadable file. Therefore the tolerance contract sits one layer down: `discoverRecordFiles()` **never throws for a single bad file** — it returns the file with `error?` populated (the field already exists in the published `FSRecordFile`), and the caller decides. Rule for consumers: filter on `FSRecordFile.error?` before calling `readContent()`. Discovery tolerates; the content source is strict. _Settled as producer, 2026-10-13, at `ART_JS`'s request before instruction regen; `PROPOSED` on the whiteboard for `ART_WORK`'s confirmation._
- **Discovery ordering is an explicit contract: ascending absolute path (2026-10-13, settled).** `discoverRecordFiles()` returns files sorted ascending by absolute path — deterministic and stable across runs and machines for the same inputs. Already true in the implementation (`.sort()` on the flattened candidate set); promoting it from incidental behaviour to guarantee because `$ART_WORK` reports on it. _`PROPOSED` on the whiteboard for `ART_WORK`'s confirmation._
- **Two units, not one (2026-10-13):** the adapter is _not_ itself an `ArtContentSource`. A content source addresses exactly one URI (`ArtContentSource.uri`, `maybeContent`), while the adapter spans a search tree. So `FSContentSource` (one per file) implements `ArtContentSource`, and `FSRecordsAdapter` is discovery + `createContentSource(file)`. This matches the `FSContentSource → ArtContentSource → ArtDocumentSource → ArtRecordCapsule` layering in the Art JS design and its FS-adapter row (`FSContentSource`, `FSRecordFile`, `FSRecordPosition`, `FSRecordsAdapter`). _Surfaced on the whiteboard 2026-10-13 — the AGREED layering bullet reads "the adapter implements `ArtContentSource`", which this refines. `ART_MD` confirmed this is the sanctioned pattern._
- **`FSRecordPosition` is dropped, not imported.** The design table lists it, but the agreed content contract makes position anchoring a records-domain concern: `writeRecord` is a line-splice against a content string, and the adapter never sees a position. No `RecordPosition` import is needed in this package.
- **`FSContentSource.uri` is `file://{filename}`** (absolute path), no line-range suffix — the adapter deals in whole files, not slices.
- **Chain agreements (2026-10-13, `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`)** supersede the adapter-local naming below: package canonical name is `@art-lib/fs-records` (`@art-lib/fs-records-adapter` retired); unit is `FSRecordsAdapter` / `createFSRecordsAdapter(FSRecordsAdapterOptions)` with method `discoverRecordFiles()` (`FSRecordsStore` / `createFSRecordsStore()` / `listFiles()` retired); persistence is `writeContent(content)` per the `ArtContentSource` contract, with record serialisation owned by the `@art-js/records` facade (`writeRecord(file, record, recordWrite)` retired); contracts import from `@art-md/primitives@0.0.3`, record-model symbols from `@art-js/records`. The HELD instructions and the consumer's `art-work-cli-global-install` capture must be re-baselined onto these before delegation.
- `FSRecordsAdapter.discoverRecordFiles()` is async (`Promise<FSRecordFile[]>`), not sync, because discovery (`discoverRecordFiles()`) is async. _Confirmed by `$ART_WORK` — all adapter entry points are async._
- `FSRecordFile.searchPath` is renamed to `FSRecordFile.basePath` to align with the `discoverRecordFiles(basePath, ...)` signature. _Already reflected in the published consumer capture; unchanged._
- Commit messages for `add-adapter-types` and `implement-fs-records-adapter` use `build` (not `feat`) per the commit message conventions (`feat` is not an allowed type).

### Knowledge to Update

- Generate `libs/fs-records/knowledge/`.

### Follow Ups

- ~~Degrade-not-fail~~ — **settled 2026-10-13**, see Decisions: tolerance lives at discovery (`error?` on `FSRecordFile`), content source is strict. Awaiting `ART_WORK`'s confirmation of the `PROPOSED` contract bullet.
- ~~Stable discovery ordering~~ — **settled 2026-10-13**, see Decisions: ascending absolute path, promoted to explicit guarantee. Awaiting `ART_WORK`'s confirmation.
- ~~Regenerate the two HELD instruction files~~ — **done 2026-10-13**: `add-adapter-types.md` and `implement-fs-records-adapter.md` regenerated against the two-unit design; `SUPERSEDED` banners removed.
- **Publish `0.0.2` after iteration 1** — the agreed symbols (`discoverRecordFiles`, `FSRecordsPattern`, `FSRecordFile.basePath`) are not in the published `0.0.1`, which still exports `findRecordFiles`/`FSRecordsPath`/`FSRecordsConfig`/`searchPath`. Consumers runtime-verifying exports must expect pre-rename names until a post-iteration-1 release ships. _Filed on the whiteboard 2026-10-13 — both `ART_JS` and `ART_WORK` assumed `0.0.1` already had the new names._

### Feedback

- None.
