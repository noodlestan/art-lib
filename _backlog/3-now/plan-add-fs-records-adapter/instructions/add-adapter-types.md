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

| Variable     | Resolved Path              | Purpose                            |
| ------------ | -------------------------- | ---------------------------------- |
| `$WORKSPACE` | Current working directory  | Workspace root directory           |
| `$PROJECT`   | Provided with Prompt       | Art Lib repository                 |
| `$PACKAGE`   | `$PROJECT/libs/fs-records` | The `fs-records` package to modify |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `add-adapter-types`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Introduce the type layer for the filesystem adapter and its per-file content source. Create `files/FSContentSource.ts` implementing the `ArtContentSource` contract imported from `@art-md/primitives@0.0.3`; create `adapter/types.ts` with `FSRecordsAdapterOptions` and the `FSRecordsAdapter` interface; and export the new types from `index.ts`.

This iteration introduces no runtime behaviour — it declares types only. It deliberately does **not** re-export `ArtContentSource`: that contract belongs to `@art-md/primitives` and consumers import it there (chain-agreed import path).

## Mandatory Reading

- `$PROJECT/_guide.md` — repository layout, records management, conventions, and operating instructions.
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

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$PROJECT` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome.

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

## Changes

This iteration adds the type layer for the adapter. It introduces no runtime behaviour.

- Step 1 / 5 — Add the `@art-md/primitives` dependency
- Step 2 / 5 — Create `files/FSContentSource.ts`
- Step 3 / 5 — Create `adapter/types.ts` with adapter options and interface
- Step 4 / 5 — Export the new types from `index.ts`
- Step 5 / 5 — Commit `add-adapter-types`

## Steps

### Step `1 / 5` — Add the `@art-md/primitives` dependency

`FSContentSource` implements `ArtContentSource`, which is declared in `@art-md/primitives@0.0.3`. Add it as a runtime dependency of the package so the type resolves.

In `$PACKAGE/package.json`, add:

```json
"dependencies": {
  "@art-md/primitives": "0.0.3"
}
```

Then, from the `$WORKSPACE` root, run `npm install` to hoist the new workspace dependency — **not** inside `$PROJECT` (a local `node_modules` there shadows the monorepo resolution and breaks the build).

Notes:

- `0.0.3` is published and frozen for this chain; pin it exactly, do not use a range.
- This package imports `ArtContentSource` as a **type only**. Do not add `@art-md/constructs` — that package is `@art-js/records`' dependency for the record bridge, not this adapter's.

Expected outcome: `@art-md/primitives@0.0.3` resolves from `$PACKAGE`, and `npm run build` can type-resolve the import added in step 2.

### Step `2 / 5` — Create `files/FSContentSource.ts`

Create `$PACKAGE/src/files/FSContentSource.ts`:

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

Notes:

- `FSContentSource` extends `ArtContentSource`, so it inherits `type`, `uri`, `maybeContent`, `readContent()`, and `writeContent()` — it must not narrow or widen any of them.
- The narrowed `type: 'fs'` discriminates this source from other `ArtContentSource` implementations.
- `uri` and `maybeContent` are declared readonly on the contract; the implementing factory (next iteration) backs them with getters.

Expected outcome: `files/FSContentSource.ts` declares `FSContentSource` and type-resolves `ArtContentSource` from `@art-md/primitives`.

### Step `3 / 5` — Create `adapter/types.ts` with adapter options and interface

Create `$PACKAGE/src/adapter/types.ts`. Import `FSContentSource` and `FSRecordFile` from `../files/types`' sibling modules:

```ts
import type { FSContentSource } from '../files/FSContentSource';
import type { FSRecordFile, FSRecordsPattern } from '../files/types';

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

Notes on the interface:

- `discoverRecordFiles` is async because the underlying discovery walks the filesystem and resolves gitignore state.
- The optional `kinds` filter narrows discovery to record files whose kind matches, mirroring the existing free function's parameter.
- `createContentSource` is **synchronous** — it returns a `FSContentSource` handle; the async work happens inside that handle's `readContent()`/`writeContent()`.

Expected outcome: `adapter/types.ts` declares `FSRecordsAdapterOptions` and `FSRecordsAdapter`.

### Step `4 / 5` — Export the new types from `index.ts`

Update `$PACKAGE/src/index.ts` to export the new types alongside the existing exports:

```ts
export { findRecordFiles } from './findRecordFiles.js';
export { readRecordFileContent } from './readRecordFileContent.js';
export type { FSRecordFile, FSRecordsConfig, FSRecordsPath } from './types.js';
export type { FSContentSource } from './files/FSContentSource.js';
export type { FSRecordsAdapter, FSRecordsAdapterOptions } from './adapter/types.js';
```

Keep the existing export lines intact — this iteration adds types, it does not rename or remove anything. (The `FSRecordsPath` → `FSRecordsPattern` and `findRecordFiles` → `discoverRecordFiles` renames belong to `refactor-module-layout`, which runs **before** this iteration. If that iteration has already landed, mirror its final export shape here and only append the two new type exports.)

Notes:

- `ArtContentSource` is intentionally **not** re-exported. Consumers import it from `@art-md/primitives` — single source of truth for the contract.
- Append `.js` extensions to match the existing import style in this package (ESM/NodeNext).

Expected outcome: `index.ts` exports the two new types and retains all pre-existing exports.

### Step `5 / 5` — Commit `add-adapter-types`

---

#### Commit: `add-adapter-types`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(fs-records): Add FSContentSource and adapter type layer.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify `@art-md/primitives@0.0.3` is declared in `$PACKAGE/package.json` dependencies and resolves.
- Verify `files/FSContentSource.ts` declares `FSContentSource extends ArtContentSource` with the narrowed `type: 'fs'`.
- Verify `adapter/types.ts` declares `FSRecordsAdapterOptions` and `FSRecordsAdapter`, and that `discoverRecordFiles` is async while `createContentSource` is sync.
- Verify the new types are exported from `index.ts` and that **no** `RecordSource`/`RecordDTO`/`BaseRecordStructure`/`FSRecordPosition`/`FSRecord`/`RecordReadImplementation`/`RecordWriteImplementation` symbols exist anywhere in the package.
- Verify `ArtContentSource` is **not** re-exported from `index.ts`.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
