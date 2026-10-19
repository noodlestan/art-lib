# Instructions: `scaffold-config-package`

**Plan:** `add-config`

**Iteration Id:** `scaffold-config-package`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-add-config/instructions/scaffold-config-package__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `scaffold-config-package`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

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
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `scaffold-config-package`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Create the `@art-lib/config` package skeleton mirroring `libs/fs-records` conventions, before adding modules. No runtime behaviour — package scaffolding only.

## Mandatory Reading

- `$PROJECT/_guide.md` — repository layout, records management, conventions, and operating instructions.
- `$PROJECT/libs/fs-records/_guide.md` — package layout and conventions to mirror.
- `$PROJECT/knowledge/components.md` — package components and planned packages.
- `$PROJECT/knowledge/design/config.md` — package API and behavioral contracts to preserve.

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

This iteration scaffolds the `@art-lib/config` package. No runtime behaviour — package skeleton only.

- Step 1 / 6 — Create `package.json`
- Step 2 / 6 — Create `tsconfig.json` and vitest config
- Step 3 / 6 — Create `src/index.ts` placeholder
- Step 4 / 6 — Create `_guide.md`
- Step 5 / 6 — Create `_records/package.art`
- Step 6 / 6 — Commit `scaffold-config`

## Steps

### Step `1 / 6` — Create `package.json`

Create `$PACKAGE/package.json` mirroring `libs/fs-records/package.json` conventions:

```json
{
  "name": "@art-lib/config",
  "version": "0.0.1",
  "description": "Typed config loading with bundle-at-runtime compilation and content-hash cache.",
  "keywords": ["library", "config", "esbuild", "cli", "tooling", "art", "terminal-apps"],
  "author": "Noodlestan Collective",
  "license": "MIT",
  "private": false,
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs"
    }
  },
  "files": ["dist", "LICENSE-MIT", "README.md"],
  "scripts": {
    "dev": "esbuild-cli-watch",
    "lint": "prettier . -c && eslint . && tsc --noEmit",
    "lint:fix": "prettier . -c --write && eslint . --fix",
    "build": "esbuild-cli",
    "build:clean": "rm -rf dist",
    "test": "vitest run",
    "test:ci": "vitest run --coverage",
    "test:watch": "vitest",
    "ci": "npm run lint && npm run build && npm run test:ci"
  },
  "dependencies": {
    "esbuild": "^0.24.0"
  },
  "devDependencies": {}
}
```

Notes:

- `exports` with `types`/`import` pointing to `dist/`, mirroring `libs/fs-records` (no `main`/`types` at root).
- Runtime dependency on `esbuild` — bundle-at-runtime compilation.
- Scripts mirror `libs/fs-records` conventions.
- `files` lists `dist`, `LICENSE-MIT`, `README.md` for publishing.

Expected outcome: `$PACKAGE/package.json` created with name `@art-lib/config` and runtime `esbuild` dependency.

### Step `2 / 6` — Create `tsconfig.json` and vitest config

Create `$PACKAGE/tsconfig.json` and `$PACKAGE/vitest.config.ts` extending the monorepo configs, mirroring `libs/fs-records`.

Expected outcome: TypeScript and Vitest configs in place.

### Step `3 / 6` — Create `src/index.ts` placeholder

Create `$PACKAGE/src/index.ts`:

```ts
// @art-lib/config — typed config loading with bundle-at-runtime compilation.
// Public surface lands in subsequent iterations.
export {};
```

Expected outcome: placeholder entry point created.

### Step `4 / 6` — Create `_guide.md`

Create `$PACKAGE/_guide.md` mirroring `libs/fs-records/_guide.md`, describing the package and its operating instructions (lint, build, test commands).

Expected outcome: `_guide.md` created.

### Step `5 / 6` — Create `_records/package.art`

Create `$PACKAGE/_records/package.art` mirroring `libs/fs-records/_records/package.art`, with Canonical Name `@art-lib/config`.

Expected outcome: package record created.

### Step `6 / 6` — Commit `scaffold-config`

---

#### Commit: `scaffold-config`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```
scaffold(config): Scaffold package skeleton.

- Create manifest, tsconfig, vitest config, and scripts mirroring `libs/fs-records`.
- Add `_guide.md` and `_records/package.art`.
```

---

## Final Verification

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy.
- Verify `package.json` has name `@art-lib/config` and runtime dependency `esbuild`.
- Verify `src/index.ts` exists as a placeholder.
- Verify `_guide.md` and `_records/package.art` exist.
- Verify `npm run build` and `npm run test` pass from `$PACKAGE`.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
