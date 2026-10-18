# Instructions: `update-readme`

**Plan:** `add-fs-records-knowledge`

**Iteration Id:** `update-readme`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-add-fs-records-knowledge/instructions/update-readme__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `update-readme`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `update-readme`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Replace the generic README with one that documents the adapter surface, exports, and basic usage.

## Mandatory Reading

- `$PROJECT/_guide.md` — repository layout, records management, conventions, and operating instructions.
- `$PACKAGE/_guide.md` — package overview, layout, and operating instructions.
- `$PACKAGE/src/index.ts` — current public exports.
- `$PACKAGE/src/adapter/types.ts` — adapter types.
- `$PACKAGE/src/files/FSContentSource.ts` — content source interface.
- `$PACKAGE/src/files/createFSContentSource.ts` — content source factory.
- `$PACKAGE/src/adapter/createFSRecordsAdapter.ts` — adapter factory.

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

This iteration updates the fs-records README to document the adapter surface.

- Step 1 / 3 — Read current exports and source files
- Step 2 / 3 — Rewrite README.md
- Step 3 / 3 — Commit `update-readme`

## Steps

### Step `1 / 3` — Read current exports and source files

Read `$PACKAGE/src/index.ts` to understand all public exports. Read the adapter and content source files to understand the API surface.

### Step `2 / 3` — Rewrite README.md

Update `$PACKAGE/README.md` with:

1. **Title and description** — `@art-lib/fs-records`: filesystem discovery and content acquisition for Art MD records.
2. **Two-unit design** — explain that `FSRecordsAdapter` handles discovery and creates per-file `FSContentSource` instances, which implement the `ArtContentSource` contract from `@art-md/primitives`.
3. **Exports table** — list all public exports (types and functions) with one-line descriptions:
   - `createFSRecordsAdapter(options)` — create an adapter
   - `createFSContentSource(file)` — create a content source for one file
   - `discoverRecordFiles(basePath, patterns, kinds?)` — standalone discovery
   - `readRecordFileContent(file)` — read file content
   - `FSRecordsAdapter` (type)
   - `FSRecordsAdapterOptions` (type)
   - `FSContentSource` (type)
   - `FSRecordFile` (type)
   - `FSRecordsPattern` (type)
4. **Usage example** — minimal code showing adapter creation, discovery, and reading content.
5. **Keep** the existing Development and Copyright sections unchanged.

### Step `3 / 3` — Commit `update-readme`

---

#### Commit: `update-readme`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
docs(fs-records): Update README with adapter surface and usage example.
```

---

## Final Verification

**Instructions:**

- Verify that `$PACKAGE/README.md` documents the adapter surface, exports, and usage.
- Verify that the README is well-formatted markdown.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
