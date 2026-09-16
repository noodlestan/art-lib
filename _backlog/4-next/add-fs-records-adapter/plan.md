# Plan: Add FS Records Adapter

**ID:** `add-fs-records-adapter`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Provide a reusable implementation for discovering, reading and writing record files.

**Description:** Refactor existing modules to classify and separate responsibilities and add the new `FSRecordsAdapter` unit.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                           | Purpose                    |
| ------------ | --------------------------------------- | -------------------------- |
| `$WORKSPACE` | Current working directory               | Workspace root directory   |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains`            | Domain resources directory |
| `$ART_LIB`   | `$WORKSPACE/checkouts/art-lib-building` | Art Lib repository.        |

## Summary

Provide a new service for finding, reading and writing records.

## Context

### Upstream Work

| Kind                  | Path                                                         | Role                                                            |
| --------------------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| Parking Lot           | `$ART_LIB/_backlog/_parking-lot.md`                          | Tracks short-term actionables, pending questions, and blockers. |
| Architecture Briefing | `$ART_LIB/_roadmap/_architect.md`                            | Art Work principles, NFRs, milestones.                          |
| Milestone             | `$ART_LIB/_roadmap/3-now/milestone-art-lib-one/milestone.md` | Scope for this library's first version.                         |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$ART_LIB/_roadmap/_architect.md` (Briefing) — Workspace principles, NFRs, milestones. Relevant for Planning Work Item.

::READ `$ART_LIB/cli/work/architecture/index.md` (Model) — Package layout, publishing, and execution model. Relevant for Planning Work Item.

## Scope

Refactor existing modules to classify and separate responsibilities and add the new `FSRecordsAdapter` unit and types.

## Work

### Next

- Delegate the next `READY` instruction: Iteration: Refactor Module Layout.

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

Additionally verify the CLI from a global installation and from the local development environment. All steps MUST pass. No `it.todo()` tests may remain.

---

## Items:

| Iteration / Instructions              | Status  |
| ------------------------------------- | ------- |
| Iteration: Refactor Module Layout     | `READY` |
| Iteration: Add FSRecordsAdapter Types | `READY` |
| Iteration: Implement FSRecordsAdapter | `READY` |

### Iteration: Refactor Module Layout

**Id:** `refactor-module-layout`

**Status:** `READY`

**Purpose:** Reorganise the `fs-records` package into a clear module structure before adding the adapter.

**Description:** Move existing modules into `files/`, `discover/`, and `test/helpers/` directories. Rename `FSRecordsPath` to `FSRecordsPattern`, remove `FSRecordsConfig`, rename `findRecordFiles()` to `discoverRecordFiles()` accepting `(basePath, patterns)`, and rename `FSRecordFile.searchPath` to `FSRecordFile.basePath`.

**Instructions:** `./add-fs-records-adapter/instructions/refactor-module-layout.md`

**Changes:**

In `$ART_LIB/libs/fs-records`

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

| ID                       | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| ------------------------ | --------------------------------- | ------------ | ---- | ---------- |
| `refactor-module-layout` | Art Lib / `$ART_LIB` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `refactor-module-layout`

**Message:**

```text
refactor(fs-records): Reorganise module layout and rename FSRecordsPattern.
```

### Iteration: Add FSRecordsAdapter Types

**Id:** `add-adapter-types`

**Status:** `READY`

**Purpose:** Introduce the type layer for the FSRecordsAdapter, including record abstractions and adapter options.

**Description:** Add `RecordSource`, `FSRecordPosition`, `FSRecordSource` to `files/types.ts`; create `adapter/types.ts` with `RecordDTO`, `BaseRecordStructure`, `FSRecord`, `FSRecordsAdapterOptions`, `RecordReadImplementation`, `RecordWriteImplementation`, and the `FSRecordsAdapter` interface. Export the new types from `index.ts`.

**Instructions:** `./add-fs-records-adapter/instructions/add-adapter-types.md`

**Changes:**

In `libs/fs-records/src/files/types.ts`:

```ts
// WIP Abstract RecordSource to be moved to an Art JS primitives package later.
export interface RecordSource {
  type: string;
  uri: string;
}

export interface FSRecordPosition {
  startLine: number; // 1-indexed
  endLine?: number; // 1-indexed, inclusive
}

export interface FSRecordSource extends RecordSource {
  type: 'fs-record';
  file: FSRecordFile;
  position?: FSRecordPosition;
}

// The `uri` in `FSRecordSource` is derived from `file.path` with an optional
// line-range suffix (e.g., `file:///path/to/file.art#L10-L20`).
```

In `libs/fs-records/src/adapter/types.ts`:

```ts
// WIP Abstract RecordDTO to be moved to an Art JS primitives package later.
export interface RecordDTO<T extends BaseRecordStructure> {
  source: RecordSource;
  record: T;
}

// WIP Abstract BaseRecordStructure to be moved to an Art JS primitives package later.
export interface BaseRecordStructure {
  kind: string;
  name: string;
}

export interface FSRecord<T extends BaseRecordStructure> extends RecordDTO<T> {
  source: FSRecordSource;
}

export interface FSRecordsAdapterOptions {
  path: string;
  extension: `.art`;
  ignored: string[];
  excluded: string[];
}

export type RecordReadImplementation<T extends BaseRecordStructure> = (content: string) => T;
export type RecordWriteImplementation<T extends BaseRecordStructure> = (record: T) => string;

export interface FSRecordsAdapter {
  options: FSRecordsAdapterOptions;
  listFiles: () => Promise<FSRecordFile[]>;
  readRecord: <T extends BaseRecordStructure>(
    file: FSRecordFile,
    recordRead: RecordReadImplementation<T>,
  ) => Promise<FSRecord<T>>;
  writeRecord: <T extends BaseRecordStructure>(
    file: FSRecordFile,
    record: T,
    recordWrite: RecordWriteImplementation<T>,
  ) => Promise<FSRecord<T>>;
}
```

Update `libs/fs-records/src/index.ts` to export the new types.

**Dependencies:**

- Iteration: Refactor Module Layout.

#### Commits:

| ID                  | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| ------------------- | --------------------------------- | ------------ | ---- | ---------- |
| `add-adapter-types` | Art Lib / `$ART_LIB` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `add-adapter-types`

**Message:**

```text
build(fs-records): Add FSRecordsAdapter types and record abstractions.
```

### Iteration: Implement FSRecordsAdapter

**Id:** `implement-fs-records-adapter`

**Status:** `READY`

**Purpose:** Implement the `createFSRecordsAdapter` factory and wire it to the existing discover/read/write utilities.

**Description:** Create `adapter/createFSRecordsAdapter.ts` implementing `FSRecordsAdapter`. Use `discoverRecordFiles()` for `listFiles()`, `readRecordFileContent()` for `readRecord()`, and `writeFile()` for `writeRecord()`. Add unit tests.

**Instructions:** `./add-fs-records-adapter/instructions/implement-fs-records-adapter.md`

**Changes:**

In `libs/fs-records/src/adapter/createFSRecordsAdapter.ts`:

```ts
function createFSRecordsAdapter(options: FSRecordsAdapterOptions): FSRecordsAdapter {
  const discoverRecordFiles = async (): Promise<FSRecordFile[]> => {
    // Build a single FSRecordsPattern from options and discover via discoverRecordFiles()
  };

  const readRecord = async <T extends BaseRecordStructure>(
    file: FSRecordFile,
    recordRead: RecordReadImplementation<T>,
  ): Promise<FSRecord<T>> => {
    // Read file content via readRecordFileContent()
    // Parse via recordRead()
    // Return FSRecord<T> with FSRecordSource
  };

  const writeRecord = async <T extends BaseRecordStructure>(
    file: FSRecordFile,
    record: T,
    recordWrite: RecordWriteImplementation<T>,
  ): Promise<FSRecord<T>> => {
    // Serialize via recordWrite(record)
    // Write to disk via writeFile()
    // Return FSRecord<T>
  };

  const api: FSRecordsAdapter = {
    options,
    discoverRecordFiles,
    readRecord,
    writeRecord,
  };

  return api;
}
```

Update `libs/fs-records/src/index.ts` to export `createFSRecordsAdapter`.

Add unit tests for the adapter in `libs/fs-records/src/adapter/createFSRecordsAdapter.test.ts`.

**Dependencies:**

- Iteration: Add FSRecordsAdapter Types.

#### Commits:

| ID                             | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| ------------------------------ | --------------------------------- | ------------ | ---- | ---------- |
| `implement-fs-records-adapter` | Art Lib / `$ART_LIB` / `building` | `AUTONOMOUS` |      | `PLANNING` |

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

- `FSRecordsAdapter.discoverRecordFiles()` is async (`Promise<FSRecordFile[]>`), not sync, because discovery (`discoverRecordFiles()`) is async. The consumer plan (`art-work-cli-global-install`) contract reference must be updated to reflect the async `discoverRecordFiles()`.
- `FSRecordsAdapter.writeRecord(file, record, recordWrite)` accepts the `record: T` to write. The originally drafted `writeRecord(file, recordWrite)` lacked the record to serialize and was not implementable.
- `FSRecordSource.uri` is derived from `file.filename` (absolute path) as `file://{filename}`. No line-range suffix is applied in `readRecord`/`writeRecord` because no position is known at those call sites.
- `FSRecordFile.searchPath` is renamed to `FSRecordFile.basePath` to align with the `discoverRecordFiles(basePath, ...)` signature.
- Commit messages for `add-adapter-types` and `implement-fs-records-adapter` use `build` (not `feat`) per the commit message conventions (`feat` is not an allowed type).

### Knowledge to Update

- Generate `libs/fs-records/architecture/`.

### Follow Ups

- None.

### Feedback

- None.
