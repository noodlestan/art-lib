# Instructions: `implement-config-cache`

**Plan:** `add-config`

**Iteration Id:** `implement-config-cache`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-add-config/instructions/implement-config-cache__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `implement-config-cache`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                        |
| ------------ | ------------------------- | ------------------------------ |
| `$WORKSPACE` | Current working directory | Workspace root directory       |
| `$PROJECT`   | Provided with Prompt      | Art Lib repository             |
| `$PACKAGE`   | `$PROJECT/libs/config`    | The `config` package to modify |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `implement-config-cache`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Add a content-hash cache inside the caller-supplied `cacheDir` (`config.bundle.mjs` + `config.cache.json` with a sha256 per esbuild `metafile.inputs` entry, recorded relative to `baseDir`, and a `version` field). Reuse the cached bundle only while every recorded input hashes the same; changed/missing/unreadable input, missing bundle, unparseable metadata, or version mismatch triggers a rebuild. Unwritable cache degrades to a temp bundle with a warning — never fails the run. `options.cache === false` bypasses reuse, rebuilds, and refreshes the cache.

## Mandatory Reading

- `$PROJECT/_guide.md` — repository layout, records management, conventions, and operating instructions.
- `$PROJECT/libs/fs-records/_guide.md` — package layout and conventions to mirror.
- `$PROJECT/knowledge/components.md` — package components and planned packages.
- `$PROJECT/knowledge/design/config.md` — cache filenames, metadata, invalidation, bypass, and fallback contracts.

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

This iteration adds the content-hash cache. Cache reuse, bypass, and graceful degradation.

- Step 1 / 5 — Create `cache.ts`
- Step 2 / 5 — Integrate cache check in `loadConfigModule.ts`
- Step 3 / 5 — Add cache tests
- Step 4 / 5 — Update `src/index.ts` exports
- Step 5 / 5 — Commit `add-config-cache`

## Steps

### Step `1 / 5` — Create `cache.ts`

Create `$PACKAGE/src/cache.ts` with:

- `findReusableBundle(cacheDir, baseDir)` — reads `config.cache.json`, verifies version and shape, hashes every recorded input (sha256, content-based, paths relative to `baseDir`); returns the bundle path only if all inputs match; otherwise returns `null` (triggering rebuild).
- Metadata read/write with version and shape guards.
- Input-hash verification: sha256 over file content, paths recorded relative to `baseDir`.

Expected outcome: `cache.ts` exports `findReusableBundle` and cache metadata helpers.

### Step `2 / 5` — Integrate cache check in `loadConfigModule.ts`

Update `$PACKAGE/src/loadConfigModule.ts`:

- Before compiling, check `findReusableBundle(cacheDir, baseDir)` when `cacheDir` is provided.
- If a reusable bundle is found, skip `build()` and import it.
- If `options.cache === false`, bypass reuse, rebuild, and refresh the cache.
- `metafile: true` on the esbuild call so inputs are recorded.
- On cache write failure, degrade to a temp bundle with a warning — never fail the run.

Expected outcome: cache reuse, bypass, and graceful degradation all work.

### Step `3 / 5` — Add cache tests

Create/update `$PACKAGE/src/loadConfigModule.test.ts` with:

- valid cache skips rebuild
- edited source rebuilds
- imported-file change rebuilds
- missing/unparseable/version-mismatch rebuilds
- unwritable cache degrades to temp bundle
- bypass rebuilds and refreshes

Expected outcome: all tests pass.

### Step `4 / 5` — Update `src/index.ts` exports

Update `$PACKAGE/src/index.ts` to export `findReusableBundle` from `cache.ts`.

Expected outcome: `findReusableBundle` exported.

### Step `5 / 5` — Commit `add-config-cache`

---

#### Commit: `add-config-cache`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
build(config): Add content-hash config cache with bypass.

- Reuse the cached bundle only while every recorded input hash matches.
- Degrade to a temp bundle when the cache is unwritable; `cache: false` refreshes.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify `@art-lib/config` builds, lints, and tests green from `$PACKAGE`.
- Verify valid cache skips rebuild; edited source rebuilds.
- Verify imported-file change rebuilds.
- Verify missing/unparseable/version-mismatch rebuilds.
- Verify unwritable cache degrades to temp bundle.
- Verify bypass rebuilds and refreshes the cache.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
