# Plan: Add FS Records Store

**ID:** `add-fs-records-store`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Provide a reusable implementation for discovering, reading and writing record files.

**Description:** Refactor existing modules to classify and separate responsibilities and add the new `FSRecordsStore` unit.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                | Purpose                                                               |
| ------------ | ---------------------------- | --------------------------------------------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory                                              |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Domain resources directory                                            |
| `$ART_LIB`   | Provided with prompt.        | Art Lib repository. Example: `$WORKSPACE/checkouts/art-work-building` |

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

Refactor existing modules to classify and separate responsibilities and add the new `FSRecordsStore` unit and types.

## Work

### Next

- Plan iterations.

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

| Iteration / Instructions      | Status     |
| ----------------------------- | ---------- |
| Iteration: Add FSRecordsStore | `PLANNING` |

### Iteration: Add FSRecordsStore

**Id:** `add-fs-records-store`

**Status:** `PLANNING`

**Purpose:** Provide a reusable implementation for discovering, reading and writing record files.

**Description:** Refactor existing modules to classify and separate responsibilities and add the new `FSRecordsStore` unit and types.

**Instructions:** `./plan-make-art-work-cli-work-from-global-install/instructions/add-fs-records-store.md`

**Changes:**

In `$ART_LIB/libs/fs-records`

Refactor modules to separate responsibilities:

- `libs/fs-records/src/readRecordFileContent.ts` goes to `libs/fs-records/src/files/readRecordFileContent.ts`
- type `FSRecordFile` moves to `libs/fs-records/src/files/types.ts`
- `libs/fs-records/src/findRecordFiles.ts` goes to `libs/fs-records/src/discover/discoverRecordFiles.ts`

Refactor test helpers:

- `libs/fs-records/src/test/makeMockRecordsConfig.ts` => `libs/fs-records/src/test/helpers/config/makeMockRecordsConfig.ts`

In `libs/fs-records/src/files/types.ts`:

```ts
// WIP Abstract RecordSource to moved to a primitives package later.
export interface RecordSource {
  type: string;
  uri: string;
}

export interface FSRecordFile extends RecordSource {
  type: 'fs-record';
  filename: string;
  basePath: string;
  path: string;
  content?: string;
  error?: Error;
}
```

Remove `FSRecordsConfig` type and make `findRecordFiles()` accept (`basePath`, `patterns`) propagate these semantics to `findRecordFilesInPath(basePath, pattern)` and `globPath()`.

Update consumers.

Rename the `FSRecordsPath` to `FSRecordsPattern`

```ts
export interface FSRecordsPattern {
  base: string;
  pattern: string | string[];
  ignored: string[];
  excluded: string[];
  gitignore: boolean;
}
```

In `libs/fs-records/src/store/types.ts`

```ts
export interface BaseRecordStructure = {
  kind: string;
  name: string;
  purpose?: string;
  description?: string;
}

export interface FSRecord<T extends BaseRecordStructure> {
  file: FSRecordFile;
  record: T;
}

export interface FSRecordsStoreOptions {
  path: string;
  extension: `.art`;
  ignored: string[];
  excluded: string[];
}

export type RecordReadImplementation<T extends BaseRecordStructure> = (content: string) => T
export type RecordWriteImplementation<T extends BaseRecordStructure> = (record: T) => string;

export interface FSRecordsStoreAPI {
  options: {}
  listRecords: <T extends BaseRecordStructure>(kind?: string[]) => FSRecord<T>
  readRecord: <T extends BaseRecordStructure>(file: FSRecordFile, recordRead: RecordReadImplementation<T>) => Promise<FSRecord<T>>
  writeRecord: <T extends BaseRecordStructure>(file: FSRecordFile, recordWrite: RecordWriteImplementation<T>) => Promise<FSRecord<T>>
}
```

In `libs/fs-records/src/store/createRecordsStore.ts`

```ts
function createRecordsStore(options: FSRecordsStoreOptions): FSRecordsStoreAPI {
  const readRecord = async () =>
  ...
  const api: FSRecordsStoreAPI = {}

  return api;
}
```

**Dependencies:**

- None.

#### Commits:

| ID                  | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| ------------------- | --------------------------------- | ------------ | ---- | ---------- |
| `add-records-store` | Art Lib / `$ART_LIB` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `add-records-store`

**Message:**

```text
refactor(art-lib): Add FSRecordsStore service.
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

- None

### Knowledge to Update

- Generate `libs/fs-records/architecture/`.

### Follow Ups

- None identified.

### Feedback

- None.
