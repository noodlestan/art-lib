# Instructions: `add-adapter-types`

**Plan:** `add-fs-records-adapter`

**Iteration Id:** `add-adapter-types`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-add-fs-records-adapter/instructions/add-adapter-types__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `add-adapter-types`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                           | Purpose                            |
| ------------ | --------------------------------------- | ---------------------------------- |
| `$WORKSPACE` | Current working directory               | Workspace root directory           |
| `$ART_LIB`   | `$WORKSPACE/checkouts/art-lib-building` | Art Lib repository                 |
| `$PACKAGE`   | `$ART_LIB/libs/fs-records`              | The `fs-records` package to modify |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `add-adapter-types`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Introduce the type layer for the `FSRecordsAdapter`, including record abstractions and adapter options. Add `RecordSource`, `FSRecordPosition`, and `FSRecordSource` to `files/types.ts`; create `adapter/types.ts` with `RecordDTO`, `BaseRecordStructure`, `FSRecord`, `FSRecordsAdapterOptions`, `RecordReadImplementation`, `RecordWriteImplementation`, and the `FSRecordsAdapter` interface; and export the new types from `index.ts`.

## Mandatory Reading

- `$PACKAGE/_guide.md` — package overview, layout, and operating instructions.
- `$PACKAGE/src/files/types.ts` — current type declarations (created in `refactor-module-layout`).
- `$PACKAGE/src/index.ts` — current public exports.

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

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$ART_LIB` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome.

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

## Changes

This iteration adds the type layer for the `FSRecordsAdapter`. It introduces no runtime behaviour.

- Step 1 / 4 — Add record abstractions to `files/types.ts`
- Step 2 / 4 — Create `adapter/types.ts` with adapter types and interface
- Step 3 / 4 — Export the new types from `index.ts`
- Step 4 / 4 — Commit `add-adapter-types`

## Steps

### Step `1 / 4` — Add record abstractions to `files/types.ts`

Append the following WIP record abstractions to `$PACKAGE/src/files/types.ts`. Keep the existing `FSRecordsPattern` and `FSRecordFile` declarations.

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

Expected outcome: `RecordSource`, `FSRecordPosition`, and `FSRecordSource` are declared in `files/types.ts`.

### Step `2 / 4` — Create `adapter/types.ts` with adapter types and interface

Create `$PACKAGE/src/adapter/types.ts` with the adapter options, record DTO abstractions, and the `FSRecordsAdapter` interface. Import `RecordSource`, `FSRecordSource`, and `FSRecordFile` from `../files/types`.

```ts
import type { FSRecordFile, FSRecordSource, RecordSource } from '../files/types';

// WIP Abstract RecordDTO to be moved to an Art JS primitives package later.
export interface RecordDTO<T extends BaseRecordStructure> {
  source: RecordSource;
  record: T;
}

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

Notes on the interface:

- `listFiles` is async (`Promise<FSRecordFile[]>`) because discovery (`discoverRecordFiles()`) is async.
- `writeRecord` accepts the `record: T` to write, in addition to the `recordWrite` serializer, so the adapter can produce the content to persist.

Expected outcome: `adapter/types.ts` declares all adapter types and the `FSRecordsAdapter` interface.

### Step `3 / 4` — Export the new types from `index.ts`

Update `$PACKAGE/src/index.ts` to export the new adapter types alongside the existing exports.

```ts
export { discoverRecordFiles } from './discover/discoverRecordFiles';
export { readRecordFileContent } from './files/readRecordFileContent';
export type { FSRecordFile, FSRecordsPattern } from './files/types';
export type {
  BaseRecordStructure,
  FSRecord,
  FSRecordsAdapter,
  FSRecordsAdapterOptions,
  RecordReadImplementation,
  RecordWriteImplementation,
} from './adapter/types';
```

Expected outcome: the new adapter types are part of the package's public API.

### Step `4 / 4` — Commit `add-adapter-types`

---

#### Commit: `add-adapter-types`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(fs-records): Add FSRecordsAdapter types and record abstractions.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `RecordSource`, `FSRecordPosition`, and `FSRecordSource` are declared in `files/types.ts`.
- Verify that `adapter/types.ts` declares `RecordDTO`, `BaseRecordStructure`, `FSRecord`, `FSRecordsAdapterOptions`, `RecordReadImplementation`, `RecordWriteImplementation`, and `FSRecordsAdapter`.
- Verify that `FSRecordsAdapter.listFiles` is async and `writeRecord` accepts `(file, record, recordWrite)`.
- Verify that the new types are exported from `index.ts`.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
