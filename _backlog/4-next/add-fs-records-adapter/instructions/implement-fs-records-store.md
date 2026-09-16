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

| Variable     | Resolved Path                           | Purpose                            |
| ------------ | --------------------------------------- | ---------------------------------- |
| `$WORKSPACE` | Current working directory               | Workspace root directory           |
| `$ART_LIB`   | `$WORKSPACE/checkouts/art-lib-building` | Art Lib repository                 |
| `$PACKAGE`   | `$ART_LIB/libs/fs-records`              | The `fs-records` package to modify |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `implement-fs-records-adapter`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Implement the `createFSRecordsAdapter` factory and wire it to the existing discover/read/write utilities. Create `adapter/createFSRecordsAdapter.ts` implementing `FSRecordsAdapter`, using `discoverRecordFiles()` for `listFiles()`, `readRecordFileContent()` for `readRecord()`, and `writeFile()` for `writeRecord()`. Export the factory and add unit tests.

## Mandatory Reading

- `$PACKAGE/_guide.md` — package overview, layout, and operating instructions.
- `$PACKAGE/src/adapter/types.ts` — the `FSRecordsAdapter` interface and adapter types (created in `add-adapter-types`).
- `$PACKAGE/src/files/types.ts` — `FSRecordFile`, `FSRecordsPattern`, `FSRecordSource`.
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

This iteration implements the `FSRecordsAdapter` factory and its unit tests.

- Step 1 / 4 — Create `adapter/createFSRecordsAdapter.ts`
- Step 2 / 4 — Export `createFSRecordsAdapter` from `index.ts`
- Step 3 / 4 — Add unit tests in `adapter/createFSRecordsAdapter.test.ts`
- Step 4 / 4 — Commit `implement-fs-records-adapter`

## Steps

### Step `1 / 4` — Create `adapter/createFSRecordsAdapter.ts`

Create `$PACKAGE/src/adapter/createFSRecordsAdapter.ts` implementing the `FSRecordsAdapter` interface.

```ts
import { writeFile } from 'node:fs/promises';

import { discoverRecordFiles } from '../discover/discoverRecordFiles';
import { readRecordFileContent } from '../files/readRecordFileContent';
import type { FSRecordFile, FSRecordSource, FSRecordsPattern } from '../files/types';
import type {
  BaseRecordStructure,
  FSRecord,
  FSRecordsAdapter,
  FSRecordsAdapterOptions,
  RecordReadImplementation,
  RecordWriteImplementation,
} from './types';

export function createFSRecordsAdapter(options: FSRecordsAdapterOptions): FSRecordsAdapter {
  const listFiles = async (): Promise<FSRecordFile[]> => {
    const pattern: FSRecordsPattern = {
      base: '.',
      pattern: `**/*${options.extension}`,
      ignored: options.ignored,
      excluded: options.excluded,
      gitignore: true,
    };
    return discoverRecordFiles(options.path, [pattern]);
  };

  const readRecord = async <T extends BaseRecordStructure>(
    file: FSRecordFile,
    recordRead: RecordReadImplementation<T>,
  ): Promise<FSRecord<T>> => {
    const fileWithContent = await readRecordFileContent(file);
    if (fileWithContent.error || fileWithContent.content === undefined) {
      throw fileWithContent.error ?? new Error(`No content for ${fileWithContent.filename}`);
    }
    const record = recordRead(fileWithContent.content);
    const source: FSRecordSource = {
      type: 'fs-record',
      uri: `file://${fileWithContent.filename}`,
      file: fileWithContent,
    };
    return { source, record };
  };

  const writeRecord = async <T extends BaseRecordStructure>(
    file: FSRecordFile,
    record: T,
    recordWrite: RecordWriteImplementation<T>,
  ): Promise<FSRecord<T>> => {
    const content = recordWrite(record);
    await writeFile(file.filename, content, 'utf-8');
    const source: FSRecordSource = {
      type: 'fs-record',
      uri: `file://${file.filename}`,
      file,
    };
    return { source, record };
  };

  const api: FSRecordsAdapter = {
    options,
    listFiles,
    readRecord,
    writeRecord,
  };

  return api;
}
```

Notes:

- `listFiles()` treats `options.path` as the search root and builds a single `FSRecordsPattern` with `base: '.'` and pattern `**/*{extension}`.
- `readRecord()` reads content via `readRecordFileContent()`, parses it via `recordRead()`, and returns an `FSRecord<T>` whose `source.uri` is `file://{filename}`.
- `writeRecord()` serializes the record via `recordWrite(record)`, writes it to `file.filename`, and returns an `FSRecord<T>`.

Expected outcome: `createFSRecordsAdapter` is exported and returns a fully wired `FSRecordsAdapter`.

### Step `2 / 4` — Export `createFSRecordsAdapter` from `index.ts`

Update `$PACKAGE/src/index.ts` to export the factory alongside the existing exports.

```ts
export { discoverRecordFiles } from './discover/discoverRecordFiles';
export { readRecordFileContent } from './files/readRecordFileContent';
export { createFSRecordsAdapter } from './adapter/createFSRecordsAdapter';
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

Expected outcome: `createFSRecordsAdapter` is part of the package's public API.

### Step `3 / 4` — Add unit tests in `adapter/createFSRecordsAdapter.test.ts`

Create `$PACKAGE/src/adapter/createFSRecordsAdapter.test.ts` covering `listFiles`, `readRecord`, and `writeRecord`.

```ts
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { createFSRecordsAdapter } from './createFSRecordsAdapter';
import type { FSRecordFile } from '../files/types';
import type { BaseRecordStructure, FSRecordsAdapterOptions } from './types';
import { makeTempDir } from '../test/helpers/tempDirs/makeTempDir';
import { removeTempDirs } from '../test/helpers/tempDirs/removeTempDirs';

const tempDirs: string[] = [];

afterEach(async () => {
  await removeTempDirs(tempDirs);
});

interface TestRecord extends BaseRecordStructure {
  kind: 'project';
  name: string;
  value: string;
}

function makeOptions(dir: string): FSRecordsAdapterOptions {
  return {
    path: dir,
    extension: '.art',
    ignored: ['node_modules/', '.git/', 'dist/'],
    excluded: [],
  };
}

describe('createFSRecordsAdapter', () => {
  it('listFiles discovers .art files under the configured path', async () => {
    const dir = makeTempDir(tempDirs);
    writeFileSync(join(dir, 'project.art'), '## Project: demo\n');
    mkdirSync(join(dir, 'sub'), { recursive: true });
    writeFileSync(join(dir, 'sub/nested.art'), '## Project: nested\n');

    const adapter = createFSRecordsAdapter(makeOptions(dir));
    const files = await adapter.listFiles();

    expect(files).toHaveLength(2);
    expect(files.map(file => file.filename)).toContain(join(dir, 'project.art'));
    expect(files.map(file => file.filename)).toContain(join(dir, 'sub/nested.art'));
  });

  it('readRecord reads content and parses via recordRead', async () => {
    const dir = makeTempDir(tempDirs);
    writeFileSync(join(dir, 'project.art'), '## Project: demo\n');

    const adapter = createFSRecordsAdapter(makeOptions(dir));
    const [file] = await adapter.listFiles();

    const record = await adapter.readRecord<TestRecord>(file!, content => ({
      kind: 'project',
      name: 'demo',
      value: content,
    }));

    expect(record.record.name).toBe('demo');
    expect(record.record.value).toContain('## Project: demo');
    expect(record.source.type).toBe('fs-record');
    expect(record.source.uri).toContain('file://');
    expect(record.source.file.filename).toBe(join(dir, 'project.art'));
  });

  it('readRecord throws when the file has no content', async () => {
    const dir = makeTempDir(tempDirs);
    const file: FSRecordFile = {
      filename: join(dir, 'missing.art'),
      basePath: dir,
      path: 'missing.art',
    };

    const adapter = createFSRecordsAdapter(makeOptions(dir));

    await expect(
      adapter.readRecord<TestRecord>(file, content => ({
        kind: 'project',
        name: 'demo',
        value: content,
      })),
    ).rejects.toThrow();
  });

  it('writeRecord serializes via recordWrite and writes to disk', async () => {
    const dir = makeTempDir(tempDirs);
    const filename = join(dir, 'project.art');
    writeFileSync(filename, '');

    const file: FSRecordFile = {
      filename,
      basePath: dir,
      path: 'project.art',
    };
    const record: TestRecord = { kind: 'project', name: 'demo', value: 'x' };

    const adapter = createFSRecordsAdapter(makeOptions(dir));
    const result = await adapter.writeRecord<TestRecord>(
      file,
      record,
      r => `## Project: ${r.name}\n`,
    );

    expect(result.record.name).toBe('demo');
    expect(result.source.type).toBe('fs-record');
    expect(readFileSync(filename, 'utf-8')).toBe('## Project: demo\n');
  });
});
```

Expected outcome: the adapter's `listFiles`, `readRecord`, and `writeRecord` are covered by passing unit tests.

### Step `4 / 4` — Commit `implement-fs-records-adapter`

---

#### Commit: `implement-fs-records-adapter`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(fs-records): Implement FSRecordsAdapter factory and tests.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `createFSRecordsAdapter` is exported from `index.ts` and returns a fully wired `FSRecordsAdapter`.
- Verify that `listFiles()` discovers `.art` files under `options.path`, `readRecord()` parses content via `recordRead`, and `writeRecord()` persists via `recordWrite`.
- Verify that `adapter/createFSRecordsAdapter.test.ts` covers `listFiles`, `readRecord`, and `writeRecord` and passes.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
