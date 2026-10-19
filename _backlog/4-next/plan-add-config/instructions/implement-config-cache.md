# Instructions: `implement-config-cache`

**Plan:** `add-config`

**Iteration Id:** `implement-config-cache`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

**Prerequisite:** `Iteration: Implement Config Loading` must be `DONE` (its files exist in `$PROJECT/libs/config/src/`). If not, REPORT A BLOCKER with "config loading not implemented yet" and STOP.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/implement-config-cache__report.md`.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse: happy face + up to 3 bullet points. The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path             | Purpose                         |
| ------------ | ------------------------- | ------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory        |
| `$PROJECT`   | Provided with prompt      | Art Lib repository (this plan). |

## Working Agreements

1. **This instructions file is self-contained.** Everything you need is here plus its mandatory reading — never rely on session memory or chat context.
2. **Your report is mandatory.** The rendered report file carries the full trail; your chat response is only a pointer to it.
3. **User interaction is minimal.** A happy face and up to 3 bullet points. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Add the content-hash cache to `@art-lib/config`: reuse the compiled bundle inside the caller's `cacheDir` while every recorded input hashes the same, bypass on demand, and never fail the run when the cache is unavailable. Commit as `build(config): Add content-hash config cache with bypass.`

## Mandatory Reading

- plan: `$PROJECT/_backlog/4-next/plan-add-config/plan.md` — this plan; the iteration Changes list the exact files.
- design: `$PROJECT/knowledge/design/config.md` — cache contracts: version/shape guards, sha256 content hashing (never mtime), bypass refresh, degrade.
- knowledge: `$PROJECT/knowledge/index.md` — package layout and publishing conventions.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci
npm run ci # verify build is green before starting
```

Do NOT run `npm install` inside `$PROJECT/libs/config` — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Instructions:** (From `$PROJECT/_guide.md`) — from `$PROJECT/libs/config/`:

```bash
npm run lint:fix
npm run lint
npm run build
npm run test
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Changes

- Step 1 / 4 — Implement `findReusableBundle` in `cache.ts`.
- Step 2 / 4 — Integrate the cache check and the bypass into `loadConfigModule`.
- Step 3 / 4 — Add unit tests and update exports.
- Step 4 / 4 — Commit `add-config-cache`.

## Steps

### Step `1 / 4` — Implement `cache.ts`

**`$PROJECT/libs/config/src/cache.ts`**

```ts
export async function findReusableBundle(cacheDir: string, baseDir: string): Promise<string | null>;
```

- Read `{cacheDir}/config.cache.json`; on missing file, unparseable JSON, missing `version`, or version/shape mismatch → return `null` (rebuild).
- Verify the bundle `{cacheDir}/config.bundle.mjs` exists; otherwise `null`.
- For every entry in `meta.inputs`: resolve `path` relative to `baseDir`, hash the current file content with sha256 (`node:crypto`), and compare with the recorded `hash`. Any mismatch, missing file, or unreadable file → `null`.
- Content-based hashing only — never mtime.
- Return the bundle path when every recorded input hashes the same.

Ensure `compileConfig` writes `config.cache.json` alongside the bundle when `cacheDir` is given: a `ConfigCacheMeta` with `version` (the current metadata version, start at `1`), `compiledAt` (ISO timestamp), `entry` (relative to `baseDir`), and `inputs` (each `metafile.inputs` key hashed with sha256, recorded relative to `baseDir`). If this writing step already partially exists from the loading iteration, complete it here so the metadata shape matches `ConfigCacheMeta`.

### Step `2 / 4` — Integrate cache and bypass

**`$PROJECT/libs/config/src/loadConfigModule.ts`**

- When `options.cacheDir` is set and `options.cache !== false`: try `findReusableBundle(cacheDir, baseDir)` first; on a hit, import the cached bundle and skip compilation; on `null`, compile (which refreshes bundle + metadata).
- When `options.cache === false`: skip the reuse check entirely, always rebuild, and refresh the cache so the next run is warm.
- When no `cacheDir` is set: behave exactly as before (temp bundle, no caching).
- An unreadable or unwritable cache degrades to a fresh compile with a `console.warn` — the load still succeeds.

### Step `3 / 4` — Add unit tests and exports

**`$PROJECT/libs/config/src/loadConfigModule.test.ts`** (extend the loading-iteration suite):

- valid cache: a second `loadConfigModule()` call with an unchanged fixture and valid `cacheDir` skips the esbuild build (assert via timing-independent means, e.g. spying on the compile seam or rewriting the bundle marker);
- edited source → rebuild; imported-file change → rebuild;
- missing bundle, unparseable metadata, version mismatch → rebuild;
- unwritable cache directory → warning emitted, load still succeeds via temp bundle;
- `cache: false` → rebuild happens and the cache is refreshed (next run warm).

Update `$PROJECT/libs/config/src/index.ts` exports for any new public type you surfaced (`ConfigCacheMeta` already exported; export `findReusableBundle` only if the plan's Scope is met with it public — the Scope lists it as a piece to expose).

Verify from `$PROJECT/libs/config/`: `npm run lint`, `npm run build`, `npm run test`.

### Step `4 / 4` — Commit `add-config-cache`

#### Commit: `add-config-cache`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```text
build(config): Add content-hash config cache with bypass.

- Reuse the cached bundle only while every recorded input hash matches.
- Degrade to a temp bundle when the cache is unwritable; `cache: false` refreshes.
```

---

## Final Verification

- Verify that the commit has been executed according to the commit's policy.
- Verify hashing is content-based (sha256) over every recorded input — no mtime checks anywhere.
- Verify `cache: false` both bypasses reuse and refreshes the cache.
- Verify an unwritable or corrupt cache warns and still loads the config.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
