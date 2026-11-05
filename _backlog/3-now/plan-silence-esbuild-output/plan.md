# Plan: Silence esbuild Output

**ID:** `silence-esbuild-output`

**Status:** `WORKING`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Has Context File:** `FALSE`

**Skill:** `write-plan`

**Purpose:** Make `compileConfig` build with `logLevel: 'silent'` so esbuild's formatted diagnostics stop streaming into consumer CI output, with regression tests asserting silence on both the failure and success paths while thrown errors keep their full detail, ending at a prepared `UNRELEASED` changelog entry.

**Description:** Draft plan sourced from the Art Lib parking-lot item `compileConfig does not silence esbuild output` (commit `cab0558`) and from Plan: Fix Pull Checkout Test in Art Works, whose suite run emits exactly this noise and which records this fix as its upstream root cause. Root cause: `src/compile/compileConfig.ts` calls esbuild `build()` without `logLevel`, and esbuild's service child writes the `✘ [ERROR]` block to inherited stdio where no console/stderr spy can intercept it. Fix: pass `logLevel: 'silent'` — esbuild still throws with full details in `error.message`, so callers' wrapped errors are unaffected. Status `READY`: three iterations with inlined instructions are drafted for delegation — fix, regression tests, and the `UNRELEASED` changelog entry; publishing stays out of scope.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                              | Purpose                                                     |
| ------------ | ------------------------------------------ | ----------------------------------------------------------- |
| `$WORKSPACE` | Current working directory                  | Workspace root; commit-message conventions live here.       |
| `$PROJECT`   | `$WORKSPACE/checkouts/art-lib`             | Where this plan and its backlog live.                       |
| `$PACKAGE`   | `$WORKSPACE/checkouts/art-lib/libs/config` | Package under change; hosts `src/compile/compileConfig.ts`. |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains`               | Planning domain resources.                                  |

## Summary

Add `logLevel: 'silent'` to the esbuild `build()` call in `compileConfig` and lock it in with silence regression tests, so config-compile failures surface only through thrown errors and consumer CI output stops carrying esbuild's `✘ [ERROR]` diagnostics. One package: Package: Art Lib Config — `src/compile/compileConfig.ts` plus a new `src/compile/compileConfig.test.ts`. Sourced from the Art Lib parking lot and from Plan: Fix Pull Checkout Test, which records this as the upstream root fix.

## Scope

One package: make `compileConfig` build with `logLevel: 'silent'` so esbuild writes nothing to the inherited stdio, add tests asserting no console/stderr/stdout output on both the failure and success paths without weakening any existing error assertion, and record the changes in a new `UNRELEASED` changelog entry — the plan's last step.

### (Scope) Package: Art Lib Config

**Record:** `$PACKAGE/_records/package.art`

**Role:** — Changes required.

**Partial:**

- `owner` — Project: Art Lib
- `path` — `libs/config`
- `canonicalName` — `@art-lib/config`
- `deployment` — NPM Package Deployment: Art Lib Config

**Changes:**

— Add `logLevel: 'silent'` to the `buildOptions` object in `src/compile/compileConfig.ts` — the package's only esbuild `build()` call site.
— Add `src/compile/compileConfig.test.ts` asserting silence on both paths (malformed `.art-workspace.mts` fixture rejects; valid entry resolves), that `build()` receives `logLevel: 'silent'`, and that failures still throw with full details.
— Add an `UNRELEASED` entry at the top of `CHANGELOG.md` recording the changes made by this plan.

**Operations:**

— Run the package suite and confirm no `✘ [ERROR]` emission remains.
— Run `npm run ci` from `$PROJECT` on completion.

**Dependencies:**

- None.

## Execution Context

Execution occurs from `$WORKSPACE/`; project work happens in `$WORKSPACE/checkouts/art-lib/` on branch `main`, with package work and the test suite under `$WORKSPACE/checkouts/art-lib/libs/config/`.

## Upstream Work

- Parking Lot: Art Lib Backlog – `$PROJECT/_backlog/_parking-lot.md`
- Plan: Fix Pull Checkout Test – `$WORKSPACE/checkouts/art-works/_backlog/3-now/plan-fix-pull-checkout-test/plan.md`
- Milestone: Art Lib One – `$PROJECT/_roadmap/3-now/milestone-art-lib-one/milestone.md`

## Required Skills

- `write-plan` – `$WORKSPACE/.agents/skills/write-plan/SKILL.md`
- `render-template` – `$WORKSPACE/.agents/skills/render-template/SKILL.md`

## Domains

- Plans – `$DOMAINS/plans/index.md`
- Work – `$DOMAINS/work/index.md`

## Resource Kinds in Scope

- Package – `$DOMAINS/packages/structures/package.art`

## Workflows

- Planning Work – `$DOMAINS/work/workflows/planning-work/workflow.art`
- Executing Work – `$DOMAINS/work/workflows/executing-work/workflow.art`

## Knowledge

- Guide: Noodlestan Workspace – `$WORKSPACE/_guide.md`
- Conventions: Writing Commit Message – `$WORKSPACE/knowledge/conventions/writing-commit-message.art`

---

## Items:

| Iteration / Instructions                      | Status  |
| --------------------------------------------- | ------- |
| Iteration: Pass Silent Log Level `inlined`    | `DONE`  |
| Iteration: Assert Compile Silence `inlined`   | `READY` |
| Iteration: Add Unreleased Changelog `inlined` | `READY` |

### Iteration: Pass Silent Log Level

**Id:** `pass-silent-log-level`

**Status:** `DONE`

**Purpose:** Stop esbuild from printing its formatted diagnostics by building with `logLevel: 'silent'`, so failures surface only through the thrown error.

**Description:** Adds `logLevel: 'silent'` to `buildOptions` in `src/compile/compileConfig.ts`, the package's single esbuild `build()` call site. esbuild still rejects with the full formatted diagnostic in `error.message`, so `loadConfigModule`'s wrapped errors and every existing assertion stay green, while the suite's `✘ [ERROR]` emission disappears.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$PACKAGE/src/compile/compileConfig.ts`

- Add `logLevel: 'silent',` to the `buildOptions` object literal (it already `satisfies BuildOptions` — no type change needed).
- Do not touch error handling or any other option: `build()` keeps rejecting on failure and `error.message` keeps the full formatted diagnostic.
- Run the package suite and confirm it passes with no `✘ [ERROR]` block — the previously-emitting test is `WHEN the config entry is missing — propagates the compiler error`.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above.

Before starting:

- Run `npm ci` from the `$PROJECT` root (Operating Instructions: Setting Up).

Validate that:

- `buildOptions` carries `logLevel: 'silent'` and still `satisfies BuildOptions`.
- `npm run test` in `$PACKAGE` passes and the output contains no `✘ [ERROR]` block (Operating Instructions: Verifying Step).

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section.
- Commit `silence-compile-config` with the blueprint message below.

**Dependencies:**

- None.

#### Commits:

| ID                       | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ------------------------ | ------------------------------ | ------------ | --------- | ----------- |
| `silence-compile-config` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `bb1f004` | `COMMITTED` |

##### Commit: `silence-compile-config`

**Message:**

```text
fix(config): Silence esbuild output in compileConfig.

- Pass `logLevel: 'silent'` to `build()`; failures still throw with full details.
```

### Iteration: Assert Compile Silence

**Id:** `assert-compile-silence`

**Status:** `READY`

**Purpose:** Lock the silence in with regression tests covering the failure path, the success path, and the argument esbuild receives.

**Description:** Adds `src/compile/compileConfig.test.ts` following the suite's established patterns: the `vi.fn(actual.build)` esbuild mock, `console.*` and `process.stdout/stderr.write` spies, and an `art-lib-config-test-` temp dir. The failure case writes a temp `.art-workspace.mts` whose first line is `export default {{{` and expects `compileConfig` to reject with the parse detail; the success case compiles a valid entry. Both assert silence and `logLevel: 'silent'` in the `build()` call — the argument assertion is the non-vacuous guard, because esbuild's service child writes at fd level where stream spies cannot see a regression.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$PACKAGE/src/compile/`

- Create `compileConfig.test.ts` with:
  — the esbuild mock already used in `src/load/loadConfigModule.test.ts` (`vi.mock('esbuild', …)` wrapping `actual.build` in `vi.fn`), so the real build runs and its arguments stay inspectable;
  — `beforeEach` spies on `console.log/warn/error` and `process.stdout.write`/`process.stderr.write` (mocked to no-ops), `afterEach` restores mocks and removes temp dirs;
  — test `WHEN the config entry fails to bundle — it rejects without console or stream output`: write `export default {{{` to a temp `.art-workspace.mts`, `await expect(compileConfig(entryPath)).rejects.toThrow(/Expected identifier/)` (relax to esbuild's actual stable substring if the wording differs — never a catch-all), then assert no spy was called and `buildMock` received `expect.objectContaining({ logLevel: 'silent' })`;
  — test `WHEN the config entry bundles — it resolves without console or stream output`: a valid `art.config.ts` entry resolves to a `bundlePath`, with the same silence and `logLevel` assertions.
- Run the package suite and the repository verification; commit the change.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above, mirroring `src/load/loadConfigModule.test.ts` conventions (`WHEN … — …` test names, `mkdtempSync` temp dirs with the `art-lib-config-test-` prefix).

Before starting:

- Run `npm ci` from the `$PROJECT` root (Operating Instructions: Setting Up).
- Read `$PACKAGE/src/load/loadConfigModule.test.ts` for the esbuild mock, spy, and temp-dir patterns to mirror.

Validate that:

- Both tests pass and assert all three properties: no console/stream writes, `logLevel: 'silent'` reaching `build()`, and the failure still rejecting with the formatted detail.
- No new `✘ [ERROR]` emission appears anywhere in the suite output.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section.
- Commit `assert-compile-silence` with the blueprint message below.

**Dependencies:**

- Iteration: Pass Silent Log Level — the `logLevel` assertion is red until the fix lands.

#### Commits:

| ID                       | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| ------------------------ | ------------------------------ | ------------ | ------- | ---------- |
| `assert-compile-silence` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `assert-compile-silence`

**Message:**

```text
test(config): Assert compileConfig emits no output.

- Cover the failure and success paths; assert `logLevel: 'silent'` reaches `build()`.
```

### Iteration: Add Unreleased Changelog

**Id:** `add-unreleased-changelog`

**Status:** `READY`

**Purpose:** Record the changes made by this plan in the package changelog as a new `UNRELEASED` entry, so the next release inherits a ready-made section.

**Description:** Inserts `## UNRELEASED` directly under the `# CHANGELOG` heading of `$PACKAGE/CHANGELOG.md`, above `## 0.0.1`, with Keep a Changelog-style subsections covering both commits of this plan — the `logLevel: 'silent'` fix under `### Fixed` and the regression tests under `### Added`. No workspace precedent for `UNRELEASED` exists yet; this iteration establishes it. Nothing is published and no version is bumped.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$PACKAGE/CHANGELOG.md`

- Insert an `## UNRELEASED` section between `# CHANGELOG` and `## 0.0.1`:

```md
## UNRELEASED

### Fixed

- **compileConfig():** Stop esbuild from writing formatted diagnostics to stdout/stderr — builds with `logLevel: 'silent'`; failures still throw with full details in `error.message`.

### Added

- **compileConfig silence tests:** Regression coverage asserting no console/stream output on the failure and success paths, and that `build()` receives `logLevel: 'silent'`.
```

- Do not touch `## 0.0.1` or any other section; do not bump `version` in `package.json`.
- Run the repository verification; commit the change.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above.

Before starting:

- Run `npm ci` from the `$PROJECT` root (Operating Instructions: Setting Up).
- Confirm Iterations: Pass Silent Log Level and Assert Compile Silence are `DONE` — the entry records changes that must already exist.

Validate that:

- `CHANGELOG.md` reads `# CHANGELOG`, then `## UNRELEASED`, then `## 0.0.1` — the existing entry is unchanged.
- The bullets match the two landed commits (`silence-compile-config`, `assert-compile-silence`).

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section.
- Commit `changelog-unreleased` with the blueprint message below.

**Dependencies:**

- Iteration: Pass Silent Log Level.
- Iteration: Assert Compile Silence.

#### Commits:

| ID                     | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| ---------------------- | ------------------------------ | ------------ | ------- | ---------- |
| `changelog-unreleased` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `changelog-unreleased`

**Message:**

```text
docs(config): Add UNRELEASED changelog entry.

- Record the `logLevel: 'silent'` fix and its regression tests ahead of the next release.
```

## Work

### Next

Delegate Iteration: Assert Compile Silence to a worker, then integrate; after it lands, delegate Iteration: Add Unreleased Changelog.

### Blockers

- None.

---

## Operating Instructions

| Operation              | Source                 | Origin | Overrides | Workflow       | Purpose                                                                                          |
| ---------------------- | ---------------------- | ------ | --------- | -------------- | ------------------------------------------------------------------------------------------------ |
| Setting Up             | `$PROJECT/_guide.md`   |        |           | Executing Work | Prepare the execution environment.                                                               |
| Verifying Step         | `$PACKAGE/_guide.md`   |        |           | Executing Work | Confirms that an executed work step produces the expected result and satisfies its requirements. |
| Writing Commit Message | `$WORKSPACE/_guide.md` |        |           | Planning Work  | Write standardized message according to context conventions.                                     |
| Verifying Completion   | `$PROJECT/_guide.md`   |        |           | Executing Work | Confirms that the work item has been completed and satisfies its intended outcome.               |

::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` — Commit message conventions.

---

## Coordination

### Not In Scope

- **Release** — publishing `@art-lib/config@0.0.2` is out of scope (decided); the plan ends at the prepared `UNRELEASED` changelog entry, and the downstream Art Works plan keeps its in-scope mock until a release lands — tracked under Follow Ups.
- **Downstream Art Works cleanup** — dropping `compileMock.mockRejectedValueOnce` in `$WORKSPACE/checkouts/art-works` belongs to Plan: Fix Pull Checkout Test; this plan changes only Art Lib.
- **Build tooling** — `esbuild-cli` package builds (`npm run build`) are unrelated to runtime config compilation and keep their own output.

### Evidence

- **Live noise in this checkout** — the pre-commit CI for `cab0558` emitted `✘ [ERROR] Could not resolve "/tmp/art-lib-config-test-TV311N/missing.config.ts"` from `@art-lib/config:ci` while all 16 tests passed — the failure-path fixture `WHEN the config entry is missing` streams esbuild's formatted diagnostic.
- **Single call site** — esbuild's `build()` is imported only by `src/compile/compileConfig.ts` (plus the test's spy wrapper), so one `logLevel` silences the whole package.
- **Error detail survives silence** — esbuild keeps the full formatted diagnostic in `error.message` at `logLevel: 'silent'`; existing assertions such as `rejects.toThrow(/Could not resolve/)` stay green.
- **Suite verified quiet** — worker reported commit `bb1f004` (pushed): package suite 16/16 green with no `✘ [ERROR]` block, Verifying Step and `npm run ci` green.

### Findings

- **esbuild service child bypasses JS streams** — probe-verified in Plan: Fix Pull Checkout Test: the service child writes to inherited stdio, so `process.stderr.write`/console spies cannot intercept it; the silence test therefore also asserts the `logLevel` argument received by `build()`.
- **The noise is deliberate-fixture fallout** — both observed emissions (`Could not resolve` here, `export default {{{` in Art Works) come from legitimate failure-path tests; the defect is esbuild printing, not the fixtures.

### Decisions

- **`logLevel: 'silent'` over `'error'`** — `'error'` would still print the error block; `'silent'` suppresses printing entirely while the throw keeps every detail for callers.
- **Fix and tests in two commits** — the fix lands first (suite goes quiet), the regression test locks it in.
- **End at an `UNRELEASED` changelog entry** — the plan prepares `CHANGELOG.md` with the changes made but stops short of publishing; `docs(config): Add UNRELEASED changelog entry.` is its last commit. No `UNRELEASED` precedent existed in the workspace; this plan establishes it.

### Knowledge to Update

- None.

### Follow Ups

- **Publish `@art-lib/config@0.0.2`** — bump `version` to `0.0.2`, promote the `UNRELEASED` entry to `0.0.2`, publish, flip the deployment records; unblocks Art Works' `silence-bundle-fixture-noise` mock removal (recorded in their plan's Follow Ups).

### Feedback

- **IRRELEVANT update (recorded by Prepare Delegation)** — `### Blockers` renders `- None.` while `plan.tart` instructs omitting the section when `work.blockers` is empty; plan owner to drop the section on next edit.
