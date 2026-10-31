# Instructions: `add-knowledge-dir`

**Plan:** `add-fs-records-knowledge`

**Iteration Id:** `add-knowledge-dir`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-add-fs-records-knowledge/instructions/add-knowledge-dir__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `add-knowledge-dir`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `add-knowledge-dir`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Create the `knowledge/` directory with overview, components, and ADR files honouring the contracts agreed on the Art Records whiteboard.

## Mandatory Reading

- `$PROJECT/_guide.md` — repository layout, records management, conventions, and operating instructions.
- `$PACKAGE/_guide.md` — package overview, layout, and operating instructions.
- `$PACKAGE/src/index.ts` — current public exports.
- `$PACKAGE/src/adapter/types.ts` — adapter types.
- `$PACKAGE/src/files/FSContentSource.ts` — content source interface.
- `$PACKAGE/src/files/createFSContentSource.ts` — content source factory.
- `$PACKAGE/src/adapter/createFSRecordsAdapter.ts` — adapter factory.
- `$PACKAGE/src/discover/discoverRecordFiles.ts` — discovery function.
- `$PACKAGE/src/files/types.ts` — FSRecordsPattern and FSRecordFile types.
- `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md` — agreed contracts under `## Contracts > @art-lib/fs-records`.
- `$ART_MD/libs/primitives/knowledge/index.md` — reference for knowledge directory format.
- `$PROJECT/knowledge/overview.md` — reference for overview format (this repository's own overview; `art-md` primitives ships only `index.md`, `api.md`, and `implementation.md`).
- `$PROJECT/knowledge/adr/frameworks.md` — reference for ADR format.
- `$WORKSPACE/checkouts/art-works/cli/workspace/package.json` — real consumer of `@art-lib/fs-records@0.0.3` (usage evidence).
- `$WORKSPACE/checkouts/art-js/tests/records/package.json` — real consumer of `@art-lib/fs-records@0.0.3` (usage evidence).

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

This iteration creates the knowledge directory with four files.

- Step 1 / 6 — Create `knowledge/index.md`
- Step 2 / 6 — Create `knowledge/overview.md`
- Step 3 / 6 — Create `knowledge/components.md`
- Step 4 / 6 — Create `knowledge/adr/adapter-contracts.md`
- Step 5 / 6 — Verify all files are well-formed
- Step 6 / 6 — Commit `add-knowledge-dir`

## Steps

### Step `1 / 6` — Create `knowledge/index.md`

Create `$PACKAGE/knowledge/index.md` as the entry point for the knowledge directory. Follow the format from `$ART_MD/libs/primitives/knowledge/index.md`.

Contents:

````markdown
# Knowledge: FS Records

The `@art-lib/fs-records` package provides filesystem discovery and content acquisition for Art MD records.

## Documents

| Document                                             | Description                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| [overview.md](overview.md)                           | Package purpose, two-unit design, contracts, and dependencies |
| [components.md](components.md)                       | Module breakdown and responsibility of each                   |
| [adr/adapter-contracts.md](adr/adapter-contracts.md) | Design decisions from the Art Records whiteboard              |

## Layout

Its `src/` layout:

\```
src/
├── adapter/ # FSRecordsAdapter factory and types
├── discover/ # discoverRecordFiles and tests
├── files/ # FSContentSource, types, readRecordFileContent
├── private/ # internal helpers (glob, filter, gitignore)
├── test/ # test helpers (config, tempDirs)
└── index.ts # public exports
\```

## Related Knowledge

- `$ART_MD/libs/primitives/knowledge/index.md` — `ArtContentSource` contract.
- `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md` — agreed contracts.
````

NOTE for you, the worker — not part of the file contents above: write those two Related Knowledge entries as backticked path-variable references exactly as shown. Do NOT convert them into relative markdown links; this repository has no precedent for links that escape the checkout, and such a link would break wherever the package is consumed without sibling checkouts.

### Step `2 / 6` — Create `knowledge/overview.md`

Create `$PACKAGE/knowledge/overview.md` describing the package purpose and design.

Contents should cover:

1. **Purpose** — `@art-lib/fs-records` provides filesystem discovery and content acquisition for Art MD records. It is the FS backend for the records chain: discover files, read content, write content. No record semantics, no template rendering.

2. **Two-unit design:**
   - `FSRecordsAdapter` — created via `createFSRecordsAdapter(options)`. Owns the search tree (basePath + patterns). Provides `discoverRecordFiles(kinds?)` and `createContentSource(file)`. NOT itself an `ArtContentSource` — it spans a search tree, while a content source addresses one URI.
   - `FSContentSource` — created via `createFSContentSource(file)`. Implements `ArtContentSource` from `@art-md/primitives`. One per file. `readContent()` lazily loads and caches; `writeContent(content)` persists and refreshes cache. URI is `file://{filename}`.

3. **Contracts (from the Art Records whiteboard):**
   - Content source is strict: `readContent()` throws on error (upstream `Promise<string>` is frozen).
   - Discovery tolerates: `discoverRecordFiles()` returns files with `error?` populated for unreadable files. Consumers filter on `FSRecordFile.error?` before calling `readContent()`.
   - Discovery ordering: ascending absolute path, deterministic.
   - Naming: `discoverRecordFiles`, `FSRecordsPattern`, `FSRecordFile.basePath`.

4. **Dependency** — `@art-md/primitives` for the `ArtContentSource` contract.

5. **Real consumers (usage evidence)** — `@art-works/workspace-cli` (`$WORKSPACE/checkouts/art-works/cli/workspace/package.json`) and `@art-js/tests/records` (`$WORKSPACE/checkouts/art-js/tests/records/package.json`) both depend on `@art-lib/fs-records@0.0.3` from their `main`. Cite them as the evidence base for the exported API and the two-unit design — do not describe the package as unconsumed or awaiting adoption.

### Step `3 / 6` — Create `knowledge/components.md`

Create `$PACKAGE/knowledge/components.md` describing the module breakdown.

Contents should cover each module in `src/`:

1. **`adapter/`** — `FSRecordsAdapter` factory and types. `createFSRecordsAdapter(options)` returns an adapter that wraps discovery and creates content sources.
2. **`discover/`** — `discoverRecordFiles(basePath, patterns, kinds?)`. Scans directories using glob patterns, respects gitignore, filters by kind. Returns `FSRecordFile[]` sorted ascending by absolute path.
3. **`files/`** — Core types (`FSRecordFile`, `FSRecordsPattern`, `FSContentSource`), the content source factory (`createFSContentSource`), and `readRecordFileContent`.
4. **`private/`** — Internal helpers: `globPath`, `findRecordFilesInPath`, `filterByKinds`, `createRecordFile`, `getGitIgnoredSet`, `normalizeExcludes`, `normalizePatterns`, `directoryExists`.
5. **`test/`** — Test helpers: `makeMockRecordsConfig`, `makeTempDir`, `removeTempDirs`.

### Step `4 / 6` — Create `knowledge/adr/adapter-contracts.md`

Create `$PACKAGE/knowledge/adr/adapter-contracts.md` recording design decisions from the Art Records whiteboard. Follow the ADR format from `$PROJECT/knowledge/adr/frameworks.md`.

Create the `adr/` directory first. Each decision should have: **Status**, **Context**, **Decision**, **Consequences**.

Record these decisions:

**Decision 1: Two-unit layering**

- Status: Adopted
- Context: The adapter spans a search tree (basePath + patterns), while a content source addresses exactly one URI. These are different responsibilities.
- Decision: `FSRecordsAdapter` handles discovery and creates per-file `FSContentSource` instances. `FSContentSource` implements `ArtContentSource`. The adapter is NOT itself an `ArtContentSource`.
- Consequences: Clean separation — discovery logic is reusable across files; each file gets its own content source with caching and persistence. Matches the `FSContentSource → ArtContentSource → ArtDocumentSource → ArtRecordCapsule` layering.
- Source: Art Records whiteboard, `@art-lib/fs-records` contracts, agreed 2026-10-13.

**Decision 2: Content contract — strict read, persist-and-refresh write**

- Status: Adopted
- Context: `ArtContentSource.readContent()` is frozen upstream at `Promise<string>` — it cannot return `undefined`, so it must throw for unreadable files.
- Decision: `readContent()` throws on error. `writeContent(content)` persists the whole file and refreshes the in-memory cache so the next `readContent()` sees what was written.
- Consequences: Content source is stateless per call — callers get deterministic behaviour. The adapter re-reads after `writeContent()` (line anchors computed against the given content stand).
- Source: Art Records whiteboard, `@art-lib/fs-records` contracts, agreed 2026-10-13.

**Decision 3: Degrade-not-fail at discovery**

- Status: Adopted
- Context: Discovery may encounter files that exist but are unreadable (permissions, encoding). Throwing on the first bad file would abort the entire discovery.
- Decision: `discoverRecordFiles()` never throws for a single bad file — it returns the file with `error?` populated on `FSRecordFile`. Consumers filter on `FSRecordFile.error?` before calling `readContent()`.
- Consequences: Tolerance lives at discovery, not at the content source. A single bad file does not abort a batch discovery.
- Source: Art Records whiteboard, `@art-lib/fs-records` contracts, settled 2026-10-13.

**Decision 4: Discovery ordering — ascending absolute path**

- Status: Adopted
- Context: Consumers need deterministic file ordering across runs and machines.
- Decision: `discoverRecordFiles()` returns files sorted ascending by absolute path.
- Consequences: Stable and reproducible. Already true in the implementation (`.sort()` on the flattened candidate set); promoted from incidental behaviour to explicit guarantee.
- Source: Art Records whiteboard, `@art-lib/fs-records` contracts, settled 2026-10-13.

**Decision 5: Naming conventions**

- Status: Adopted
- Context: The original package exported `findRecordFiles`, `FSRecordsPath`, `FSRecordsConfig`, and `searchPath`. These were renamed to align with the agreed chain contracts.
- Decision: `findRecordFiles` → `discoverRecordFiles`, `FSRecordsPath` → `FSRecordsPattern`, `FSRecordsConfig` removed, `FSRecordFile.searchPath` → `FSRecordFile.basePath`.
- Consequences: Consumers must use the new names. They shipped in `@art-lib/fs-records@0.0.3` (release commit `b815ddc`); the pre-rename names are no longer exported.
- Source: Art Records whiteboard, `@art-lib/fs-records` contracts, agreed 2026-10-13.

### Step `5 / 6` — Verify all files are well-formed

Verify that all four knowledge files are well-formed markdown. Verify that internal links resolve.

### Step `6 / 6` — Commit `add-knowledge-dir`

---

#### Commit: `add-knowledge-dir`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
docs(fs-records): Add knowledge directory with overview, components, and ADR.
```

---

## Final Verification

**Instructions:**

- Verify that `$PACKAGE/knowledge/` exists with `index.md`, `overview.md`, `components.md`, and `adr/adapter-contracts.md`.
- Verify that `index.md` links to all three documents.
- Verify that the ADR records the five decisions with Status, Context, Decision, Consequences, and Source.
- Verify that all files are well-formed markdown.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
