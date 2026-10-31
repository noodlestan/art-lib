# Instructions: `verify-guide`

**Plan:** `add-fs-records-knowledge`

**Iteration Id:** `verify-guide`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-add-fs-records-knowledge/instructions/verify-guide__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `verify-guide`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `verify-guide`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Verify the `_guide.md` is accurate and update it to reference the knowledge directory.

## Mandatory Reading

- `$PROJECT/_guide.md` — repository layout, records management, conventions, and operating instructions.
- `$PACKAGE/_guide.md` — package overview, layout, and operating instructions.
- `$PACKAGE/src/` — actual directory structure.

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

This iteration verifies and updates the fs-records guide.

- Step 1 / 3 — Compare guide against actual layout
- Step 2 / 3 — Update guide sections
- Step 3 / 3 — Commit `verify-guide`

## Steps

### Step `1 / 3` — Compare guide against actual layout

Read `$PACKAGE/_guide.md` and compare the Package Layout section against the actual `$PACKAGE/src/` directory structure. The current layout should have: `files/`, `discover/`, `adapter/`, `private/`, `test/`.

### Step `2 / 3` — Update guide sections

Update `$PACKAGE/_guide.md`:

1. **Package Layout** — update the `src/` tree to reflect the actual structure:
   ```
   src/
   ├── adapter/      # FSRecordsAdapter factory and types
   ├── discover/     # discoverRecordFiles and tests
   ├── files/        # FSContentSource, types, readRecordFileContent
   ├── private/      # internal helpers (glob, filter, gitignore)
   ├── test/         # test helpers (config, tempDirs)
   └── index.ts      # public exports
   ```
2. **Knowledge References** — update to point to `knowledge/index.md`. That directory is created by the `add-knowledge-dir` iteration, which runs **before** this one. If `$PACKAGE/knowledge/index.md` does not exist, REPORT A BLOCKER with "knowledge directory missing — run `add-knowledge-dir` first" and STOP.
3. **Recommended Reading** — verify links resolve; update if needed.
4. Keep all other sections unchanged.

### Step `3 / 3` — Commit `verify-guide`

---

#### Commit: `verify-guide`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
docs(fs-records): Update guide with current layout and knowledge references.
```

---

## Final Verification

**Instructions:**

- Verify that `$PACKAGE/_guide.md` Package Layout matches the actual `src/` structure.
- Verify that Knowledge References points to `knowledge/index.md`.
- Verify that all Recommended Reading links resolve.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
