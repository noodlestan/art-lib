# Instructions: `implement-fs-records-adapter`

**Plan:** `add-fs-records-adapter`

**Iteration Id:** `implement-fs-records-adapter`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-add-fs-records-adapter/instructions/implement-fs-records-adapter__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `implement-fs-records-adapter`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `implement-fs-records-adapter`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Implement the two units the type layer declared: `files/createFSContentSource.ts`, the `ArtContentSource` implementation for a single file, and `adapter/createFSRecordsAdapter.ts`, discovery plus a content-source factory. Export both and cover them with unit tests.

The adapter performs filesystem discovery and content persistence only. It does not parse content, does not model records, and does not template-render — those belong to `@art-js/records` and the consuming CLI.

## Mandatory Reading

- `$PROJECT/_guide.md` — repository layout, records management, conventions, and operating instructions.
- `$PACKAGE/_guide.md` — package overview, layout, and operating instructions.
- `$PACKAGE/src/adapter/types.ts` — `FSRecordsAdapter` and `FSRecordsAdapterOptions` (created in `add-adapter-types`).
- `$PACKAGE/src/files/FSContentSource.ts` — `FSContentSource` (created in `add-adapter-types`).
- `$PACKAGE/src/files/types.ts` — `FSRecordFile`, `FSRecordsPattern`.
- `$PACKAGE/src/discover/discoverRecordFiles.ts` — discovery entry point.
- `$PACKAGE/src/files/readRecordFileContent.ts` — content reader.
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

This iteration implements the two units and their unit tests.

- Step 1 / 5 — Create `files/createFSContentSource.ts`
- Step 2 / 5 — Create `adapter/createFSRecordsAdapter.ts`
- Step 3 / 5 — Export both factories from `index.ts`
- Step 4 / 5 — Add unit tests for both units
- Step 5 / 5 — Commit `implement-fs-records-adapter`

## Steps

### Step `1 / 5` — Create `files/createFSContentSource.ts`

Create `$PACKAGE/src/files/createFSContentSource.ts`:

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
    get uri(): string {
      return `file://${file.filename}`;
    },
    get maybeContent(): string | undefined {
      return cached;
    },
    readContent,
    writeContent,
  };
}
```

Notes:

- **Stateless between calls, cached within an instance.** `maybeContent` is `undefined` until the first successful `readContent()`; `writeContent()` refreshes the cache so the next `readContent()` returns what was written without re-reading disk. A _new_ `createFSContentSource` call for the same file re-reads from disk — this is what makes line-based anchors in `@art-js/records` safe, and the opt-in content-hash guard covers out-of-band drift.
- **`uri` is `file://{filename}`** — the absolute path, no line-range suffix. The adapter deals in whole files, never slices.
- **Strict on read, tolerant on discovery.** `ArtContentSource.readContent()` is frozen upstream at `Promise<string>`, so it must throw for an unreadable file. Degradation is a _discovery_-level guarantee instead: filter on `FSRecordFile.error?` before calling `readContent()`. Do not swallow errors here.

Expected outcome: `createFSContentSource` returns a `FSContentSource` conforming to the inherited contract.

### Step `2 / 5` — Create `adapter/createFSRecordsAdapter.ts`

Create `$PACKAGE/src/adapter/createFSRecordsAdapter.ts`:

```ts
import { createFSContentSource } from '../files/createFSContentSource';
import { discoverRecordFiles } from '../discover/discoverRecordFiles';
import type { FSContentSource } from '../files/FSContentSource';
import type { FSRecordFile } from '../files/types';
import type { FSRecordsAdapter, FSRecordsAdapterOptions } from './types';

export function createFSRecordsAdapter(options: FSRecordsAdapterOptions): FSRecordsAdapter {
  const discover = async (kinds: string | string[] = []): Promise<FSRecordFile[]> =>
    discoverRecordFiles(options.basePath, options.patterns, kinds);

  const createContentSource = (file: FSRecordFile): FSContentSource => createFSContentSource(file);

  return { options, discoverRecordFiles: discover, createContentSource };
}
```

Notes:

- `discoverRecordFiles()` delegates to the existing free function with `options.basePath` and `options.patterns`; the optional `kinds` filter passes through unchanged.
- Results come back **sorted ascending by absolute path** — deterministic across runs and machines. That ordering is now an explicit contract (consumers report on it), so do not replace the sort with a non-deterministic source.
- `createContentSource` is synchronous by design: it returns a handle, and the async work lives inside that handle.
- The adapter holds no per-file state. Callers who need caching hold the `FSContentSource`; the adapter itself is safe to keep for the lifetime of a run.

Expected outcome: `createFSRecordsAdapter` is exported and returns a fully wired `FSRecordsAdapter`.

### Step `3 / 5` — Export both factories from `index.ts`

Update `$PACKAGE/src/index.ts` to export the two factories alongside the type exports added in `add-adapter-types`:

```ts
export { findRecordFiles } from './findRecordFiles.js';
export { readRecordFileContent } from './readRecordFileContent.js';
export type { FSRecordFile, FSRecordsConfig, FSRecordsPath } from './types.js';
export type { FSContentSource } from './files/FSContentSource.js';
export type { FSRecordsAdapter, FSRecordsAdapterOptions } from './adapter/types.js';
export { createFSContentSource } from './files/createFSContentSource.js';
export { createFSRecordsAdapter } from './adapter/createFSRecordsAdapter.js';
```

Keep every pre-existing export intact. As in the previous iteration, mirror the final export shape if `refactor-module-layout` has already renamed the free function.

Expected outcome: both factories are part of the package's public API.

### Step `4 / 5` — Add unit tests for both units

Create `$PACKAGE/src/files/createFSContentSource.test.ts`:

```ts
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { createFSContentSource } from './createFSContentSource';
import type { FSRecordFile } from './types';
import { makeTempDir } from '../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../test/helpers/tempDirs/removeTempDirs';

const tempDirs: string[] = [];

afterEach(async () => {
  await removeTempDirs(tempDirs);
});

function makeFile(dir: string, name: string): FSRecordFile {
  return { filename: join(dir, name), basePath: dir, path: name };
}

describe('createFSContentSource', () => {
  it('exposes type fs and a file:// uri before any read', () => {
    const dir = makeTempDir(tempDirs);
    const file = makeFile(dir, 'project.art');
    writeFileSync(file.filename, '## Project: demo\n');

    const source = createFSContentSource(file);

    expect(source.type).toBe('fs');
    expect(source.uri).toBe(`file://${file.filename}`);
  });

  it('leaves maybeContent undefined until read, then caches', async () => {
    const dir = makeTempDir(tempDirs);
    const file = makeFile(dir, 'project.art');
    writeFileSync(file.filename, '## Project: demo\n');

    const source = createFSContentSource(file);
    expect(source.maybeContent).toBeUndefined();

    const first = await source.readContent();
    expect(first).toBe('## Project: demo\n');
    expect(source.maybeContent).toBe(first);

    // A concurrent out-of-band write must NOT be observed: the instance caches.
    writeFileSync(file.filename, '## Project: changed\n');
    const second = await source.readContent();
    expect(second).toBe(first);
  });

  it('re-reads from disk on a fresh source for the same file', async () => {
    const dir = makeTempDir(tempDirs);
    const file = makeFile(dir, 'project.art');
    writeFileSync(file.filename, '## Project: v1\n');

    const first = createFSContentSource(file);
    await first.readContent();

    writeFileSync(file.filename, '## Project: v2\n');

    const second = createFSContentSource(file);
    expect(await second.readContent()).toBe('## Project: v2\n');
  });

  it('writeContent persists and refreshes the cache', async () => {
    const dir = makeTempDir(tempDirs);
    const file = makeFile(dir, 'project.art');
    writeFileSync(file.filename, '## Project: old\n');

    const source = createFSContentSource(file);
    await source.readContent();
    await source.writeContent('## Project: new\n');

    expect(readFileSync(file.filename, 'utf-8')).toBe('## Project: new\n');
    expect(source.maybeContent).toBe('## Project: new\n');
    expect(await source.readContent()).toBe('## Project: new\n');
  });

  it('readContent throws for a missing file', async () => {
    const dir = makeTempDir(tempDirs);
    const file = makeFile(dir, 'missing.art');

    await expect(createFSContentSource(file).readContent()).rejects.toThrow();
  });
});
```

Create `$PACKAGE/src/adapter/createFSRecordsAdapter.test.ts`:

```ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { createFSRecordsAdapter } from './createFSRecordsAdapter';
import type { FSRecordsAdapterOptions } from './types';
import type { FSRecordsPattern } from '../files/types';
import { makeTempDir } from '../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../test/helpers/tempDirs/removeTempDirs';

const tempDirs: string[] = [];

afterEach(async () => {
  await removeTempDirs(tempDirs);
});

const pattern: FSRecordsPattern = {
  base: '.',
  pattern: '**/*.art',
  ignored: ['node_modules/', '.git/', 'dist/'],
  excluded: [],
  gitignore: true,
};

function makeOptions(dir: string): FSRecordsAdapterOptions {
  return { basePath: dir, patterns: [pattern] };
}

describe('createFSRecordsAdapter', () => {
  it('discovers .art files under basePath, sorted ascending by path', async () => {
    const dir = makeTempDir(tempDirs);
    mkdirSync(join(dir, 'sub'), { recursive: true });
    writeFileSync(join(dir, 'project.art'), '## Project: demo\n');
    writeFileSync(join(dir, 'sub/nested.art'), '## Project: nested\n');

    const adapter = createFSRecordsAdapter(makeOptions(dir));
    const files = await adapter.discoverRecordFiles();

    expect(files.map(file => file.filename)).toEqual([
      join(dir, 'project.art'),
      join(dir, 'sub/nested.art'),
    ]);
  });

  it('returns no files for an empty directory rather than throwing', async () => {
    const dir = makeTempDir(tempDirs);

    const adapter = createFSRecordsAdapter(makeOptions(dir));

    await expect(adapter.discoverRecordFiles()).resolves.toEqual([]);
  });

  it('createContentSource returns a working FSContentSource for a discovered file', async () => {
    const dir = makeTempDir(tempDirs);
    writeFileSync(join(dir, 'project.art'), '## Project: demo\n');

    const adapter = createFSRecordsAdapter(makeOptions(dir));
    const [file] = await adapter.discoverRecordFiles();

    const source = adapter.createContentSource(file!);
    expect(source.type).toBe('fs');
    expect(source.file).toBe(file);
    expect(await source.readContent()).toBe('## Project: demo\n');
  });
});
```

Notes:

- Both suites use the existing `makeTempDir`/`removeTempDirs` helpers — do not add new temp-dir utilities.
- The ordering assertion is deliberate: it pins the ascending-path contract rather than merely checking membership.
- The empty-directory assertion pins degrade-not-fail at the discovery layer.

Expected outcome: `createFSContentSource` and `createFSRecordsAdapter` are covered by passing unit tests.

### Step `5 / 5` — Commit `implement-fs-records-adapter`

---

#### Commit: `implement-fs-records-adapter`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(fs-records): Implement FSContentSource and adapter factory with tests.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify `createFSContentSource` and `createFSRecordsAdapter` are exported from `index.ts` and return fully wired implementations.
- Verify `createFSContentSource` leaves `maybeContent` undefined until the first `readContent()`, caches within an instance, refreshes on `writeContent()`, and re-reads on a fresh instance for the same file.
- Verify `createFSRecordsAdapter.discoverRecordFiles()` is async and returns results **sorted ascending by absolute path**, and that `createContentSource()` is synchronous.
- Verify no record semantics leaked in: no parsing, no record types, no template rendering, and no `RecordSource`/`RecordDTO`/`BaseRecordStructure`/`FSRecordPosition` symbols anywhere in the package.
- Verify the test suites pass and no `it.todo()` remains.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
