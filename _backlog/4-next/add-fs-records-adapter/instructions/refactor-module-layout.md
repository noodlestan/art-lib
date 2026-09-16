# Instructions: `refactor-module-layout`

**Plan:** `add-fs-records-adapter`

**Iteration Id:** `refactor-module-layout`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-add-fs-records-adapter/instructions/refactor-module-layout__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `refactor-module-layout`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `refactor-module-layout`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Reorganise the `fs-records` package into a clear module structure before adding the adapter. Move existing modules into `files/`, `discover/`, and `test/helpers/` directories, rename `FSRecordsPath` to `FSRecordsPattern`, remove `FSRecordsConfig`, rename `findRecordFiles()` to `discoverRecordFiles()` accepting `(basePath, patterns)`, and rename `FSRecordFile.searchPath` to `FSRecordFile.basePath`.

## Mandatory Reading

- `$PACKAGE/_guide.md` — package overview, layout, and operating instructions.
- `$PACKAGE/src/index.ts` — current public exports.
- `$PACKAGE/src/types.ts` — current type declarations.
- `$PACKAGE/src/findRecordFiles.ts` — current discovery entry point.
- `$PACKAGE/src/private/*.ts` — current private helpers.
- `$PACKAGE/src/findRecordFiles.test.ts` — current discovery tests.

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

This iteration reorganises the `fs-records` package module layout and renames discovery semantics. It does not change behaviour.

- Step 1 / 8 — Reorganise module directories and move files
- Step 2 / 8 — Create `files/types.ts` with `FSRecordsPattern` and `FSRecordFile`
- Step 3 / 8 — Rename `findRecordFiles` → `discoverRecordFiles` with `(basePath, patterns)` signature
- Step 4 / 8 — Update private helpers to `(basePath, pattern)` semantics
- Step 5 / 8 — Update `filterByKinds` imports
- Step 6 / 8 — Update `makeMockRecordsConfig` test helper
- Step 7 / 8 — Update `index.ts` exports and the discovery test file
- Step 8 / 8 — Commit `refactor-module-layout`

## Steps

### Step `1 / 8` — Reorganise module directories and move files

Create the new directory structure and move the existing modules into their responsibility folders.

1. Create directories under `$PACKAGE/src/`:
   - `files/`
   - `discover/`
   - `test/helpers/config/`
2. Move `$PACKAGE/src/readRecordFileContent.ts` → `$PACKAGE/src/files/readRecordFileContent.ts`.
3. Move `$PACKAGE/src/findRecordFiles.ts` → `$PACKAGE/src/discover/discoverRecordFiles.ts`.
4. Move `$PACKAGE/src/findRecordFiles.test.ts` → `$PACKAGE/src/discover/discoverRecordFiles.test.ts`.
5. Move `$PACKAGE/src/test/makeMockRecordsConfig.ts` → `$PACKAGE/src/test/helpers/config/makeMockRecordsConfig.ts`.
6. Delete `$PACKAGE/src/types.ts` (its content is recreated in `files/types.ts` in the next step).

Expected outcome: the `src/` root contains only `index.ts`; `files/`, `discover/`, and `private/` hold the modules; `test/helpers/` holds `config/` and `tempDirs/`.

### Step `2 / 8` — Create `files/types.ts` with `FSRecordsPattern` and `FSRecordFile`

Create `$PACKAGE/src/files/types.ts` with the renamed types. `FSRecordsPath` becomes `FSRecordsPattern` (same shape) and `FSRecordFile.searchPath` becomes `FSRecordFile.basePath`.

```ts
export interface FSRecordsPattern {
  base: string;
  pattern: string | string[];
  ignored: string[];
  excluded: string[];
  gitignore: boolean;
}

export interface FSRecordFile {
  filename: string;
  basePath: string;
  path: string;
  content?: string;
  error?: Error;
}
```

Expected outcome: `FSRecordsPattern` and `FSRecordFile` are declared in `files/types.ts`. The old `FSRecordsConfig` type is removed.

### Step `3 / 8` — Rename `findRecordFiles` → `discoverRecordFiles` with `(basePath, patterns)` signature

Update `$PACKAGE/src/discover/discoverRecordFiles.ts` to export `discoverRecordFiles(basePath, patterns, kinds?)`. The `FSRecordsConfig` parameter is replaced by a `patterns: FSRecordsPattern[]` parameter and the `searchPath` parameter is renamed `basePath`.

```ts
import { createRecordFile } from '../private/createRecordFile';
import { directoryExists } from '../private/directoryExists';
import { filterFilenamesByKinds } from '../private/filterByKinds';
import { findRecordFilesInPath } from '../private/findRecordFilesInPath';
import type { FSRecordFile, FSRecordsPattern } from '../files/types';

export async function discoverRecordFiles(
  basePath: string,
  patterns: FSRecordsPattern[],
  kinds: string | string[] = [],
): Promise<FSRecordFile[]> {
  if (!directoryExists(basePath)) {
    return [];
  }

  const results = await Promise.all(
    patterns.map(pattern => findRecordFilesInPath(basePath, pattern)),
  );

  const allCandidates = new Set(results.flat());

  const kindFilter = Array.isArray(kinds) ? kinds : [kinds];
  const files = [...allCandidates].sort().map(filename => createRecordFile(basePath, filename));
  return filterFilenamesByKinds(files, kindFilter);
}
```

Expected outcome: `discoverRecordFiles` is exported with the new signature and imports `FSRecordFile`/`FSRecordsPattern` from `../files/types`.

### Step `4 / 8` — Update private helpers to `(basePath, pattern)` semantics

Update the private helpers to use `basePath` and `pattern` naming and import types from `../files/types`.

1. `$PACKAGE/src/private/findRecordFilesInPath.ts`:

```ts
import type { FSRecordsPattern } from '../files/types';

import { getGitIgnoredSet } from './getGitIgnoredSet';
import { globPath } from './globPath';

export async function findRecordFilesInPath(
  basePath: string,
  pattern: FSRecordsPattern,
): Promise<string[]> {
  const candidates = await globPath(basePath, pattern);

  if (!pattern.gitignore) {
    return candidates;
  }

  const ignoredSet = getGitIgnoredSet(basePath, candidates);
  return candidates.filter(candidate => !ignoredSet.has(candidate));
}
```

2. `$PACKAGE/src/private/globPath.ts`:

```ts
import { glob } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import type { FSRecordsPattern } from '../files/types';

import { normalizeExcludes } from './normalizeExcludes';
import { normalizePatterns } from './normalizePatterns';

export async function globPath(basePath: string, pattern: FSRecordsPattern): Promise<string[]> {
  const baseDir = join(basePath, pattern.base);
  const patterns = normalizePatterns(baseDir, pattern.pattern);
  const exclude = normalizeExcludes(baseDir, [...pattern.ignored, ...pattern.excluded]);

  const globResult = glob(patterns, { exclude });

  const entries: string[] = [];
  for await (const entry of globResult) {
    entries.push(entry);
  }

  return entries.map(entry => resolve(baseDir, entry));
}
```

3. `$PACKAGE/src/private/createRecordFile.ts` — rename `searchPath` → `basePath` and set the `basePath` field:

```ts
import { relative, resolve } from 'node:path';

import type { FSRecordFile } from '../files/types';

export function createRecordFile(basePath: string, filename: string): FSRecordFile {
  const resolvedBasePath = resolve(basePath);
  const resolvedFilename = resolve(filename);

  return {
    filename: resolvedFilename,
    basePath,
    path: relative(resolvedBasePath, resolvedFilename),
  };
}
```

4. `$PACKAGE/src/private/getGitIgnoredSet.ts` — rename `searchPath` → `basePath`:

```ts
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

export function getGitIgnoredSet(basePath: string, candidates: string[]): Set<string> {
  try {
    const output = execFileSync('git', ['check-ignore', '--no-index', '--stdin'], {
      input: candidates.join('\n'),
      cwd: basePath,
      encoding: 'utf-8',
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    return new Set(
      output
        .split('\n')
        .filter(Boolean)
        .map((line: string) => resolve(basePath, line)),
    );
  } catch {
    return new Set();
  }
}
```

Expected outcome: all private helpers use `basePath`/`pattern` naming and import types from `../files/types`.

### Step `5 / 8` — Update `filterByKinds` imports

Update `$PACKAGE/src/private/filterByKinds.ts` to import `readRecordFileContent` and `FSRecordFile` from the new `files/` locations.

```ts
import { readRecordFileContent } from '../files/readRecordFileContent';
import type { FSRecordFile } from '../files/types';
```

Keep the rest of the file unchanged.

Expected outcome: `filterByKinds.ts` compiles against the moved `readRecordFileContent` and `files/types`.

### Step `6 / 8` — Update `makeMockRecordsConfig` test helper

Update `$PACKAGE/src/test/helpers/config/makeMockRecordsConfig.ts` to return `FSRecordsPattern[]` instead of the removed `FSRecordsConfig`. The helper accepts an optional partial pattern override.

```ts
import type { FSRecordsPattern } from '../../../files/types';

export function makeMockRecordsConfig(custom?: Partial<FSRecordsPattern>): FSRecordsPattern[] {
  return [
    {
      base: '.',
      pattern: '*.art',
      ignored: ['node_modules/', '.git/', 'dist/'],
      excluded: [],
      gitignore: true,
      ...custom,
    },
  ];
}
```

Expected outcome: the helper returns a single default `FSRecordsPattern` and supports per-test overrides.

### Step `7 / 8` — Update `index.ts` exports and the discovery test file

1. Update `$PACKAGE/src/index.ts`:

```ts
export { discoverRecordFiles } from './discover/discoverRecordFiles';
export { readRecordFileContent } from './files/readRecordFileContent';
export type { FSRecordFile, FSRecordsPattern } from './files/types';
```

2. Update `$PACKAGE/src/discover/discoverRecordFiles.test.ts`:
   - Import `discoverRecordFiles` from `./discoverRecordFiles`.
   - Import `makeMockRecordsConfig` from `../test/helpers/config/makeMockRecordsConfig`.
   - Import `makeTempDir` from `../test/helpers/tempDirs/makeTempDir` and `removeTempDirs` from `../test/helpers/tempDirs/removeTempDirs`.
   - Replace every `findRecordFiles(...)` call with `discoverRecordFiles(basePath, patterns, kinds?)`:
     - `findRecordFiles(makeMockRecordsConfig(), tempDir)` → `discoverRecordFiles(tempDir, makeMockRecordsConfig())`.
     - `findRecordFiles(makeMockRecordsConfig(), tempDir, 'Project')` → `discoverRecordFiles(tempDir, makeMockRecordsConfig(), 'Project')`.
     - `findRecordFiles(makeMockRecordsConfig(), tempDir, ['Namespace', 'Project'])` → `discoverRecordFiles(tempDir, makeMockRecordsConfig(), ['Namespace', 'Project'])`.
     - `findRecordFiles(makeMockRecordsConfig(), '/nonexistent/path')` → `discoverRecordFiles('/nonexistent/path', makeMockRecordsConfig())`.
     - `findRecordFiles(makeMockRecordsConfig(), file)` → `discoverRecordFiles(file, makeMockRecordsConfig())`.
   - Replace `makeMockRecordsConfig({ paths: [{ base: '.', pattern: '*.art', ignored: ['skip.art'], excluded: [], gitignore: true }] })` with `makeMockRecordsConfig({ ignored: ['skip.art'] })`.
   - Replace `makeMockRecordsConfig({ paths: [{ base: '.', pattern: '*.art', ignored: ['node_modules/', '.git/', 'dist/'], excluded: [], gitignore: false }] })` with `makeMockRecordsConfig({ gitignore: false })`.
   - Rename the `describe` block to `discoverRecordFiles`.
   - Replace `searchPath: tempDir` assertions with `basePath: tempDir`.

Expected outcome: the test file compiles and exercises `discoverRecordFiles` with the new signature and `basePath` field.

### Step `8 / 8` — Commit `refactor-module-layout`

---

#### Commit: `refactor-module-layout`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
refactor(fs-records): Reorganise module layout and rename FSRecordsPattern.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify that `$PACKAGE/src/` root contains only `index.ts`, with modules under `files/`, `discover/`, and `private/`, and test helpers under `test/helpers/`.
- Verify that `FSRecordsPath`, `FSRecordsConfig`, and `findRecordFiles` no longer appear anywhere in `$PACKAGE/src/`.
- Verify that `FSRecordFile` uses `basePath` (not `searchPath`) and `discoverRecordFiles` accepts `(basePath, patterns)`.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
