# Plan: Add Operations Package

**ID:** `add-operations`

**Status:** `WORKING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Provide the shared CLI operation model and operations log extracted from the Art Workspace Cli and the Art MD codec bin.

**Description:** Create the `@art-lib/operations` package with two subpath modules — `/model` (operation types and factories) and `/log` (append-only operations log) — replacing duplicated plumbing in both CLIs. The buffering logger lives in the planned `@art-lib/logger` package. Reopened 2026-11-07 after the consumer adoption (`72537ab`) preserved a parallel type system instead of conforming: three iterations extend the package factory, publish `0.0.2`, and conform the CLI to the shared model.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                | Purpose                         |
| ------------ | ---------------------------- | ------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory        |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Domain resources directory      |
| `$PROJECT`   | Provided with prompt         | Art Lib repository (this plan). |

## Summary

Create `@art-lib/operations` with subpath modules `/model` and `/log`, extracting the identical operation plumbing from `@art-works/workspace-cli` and `@art-md/bin`.

## Context

### Upstream Work

| Kind        | Path                                                         | Role                                                            |
| ----------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| Parking Lot | `$PROJECT/_backlog/_parking-lot.md`                          | Tracks short-term actionables, pending questions, and blockers. |
| Milestone   | `$PROJECT/_roadmap/3-now/milestone-art-lib-one/milestone.md` | Scope and the recorded extraction decision.                     |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Resource Kinds in Scope

- Package – `$DOMAINS/packages/structures/package.art`

### Workflows

- Planning Work – `$DOMAINS/work/workflows/planning-work/workflow.art`
- Executing Work – `$DOMAINS/work/workflows/executing-work/workflow.art`

### Knowledge

::READ `$PROJECT/knowledge/design/operations.md` (Design) — Operation record contract and Operations Log semantics. Relevant for Planning Work Item.
::READ `$PROJECT/knowledge/index.md` (Model) — Package layout, publishing, and execution model. Relevant for Planning Work Item.

## Scope

Create `$PROJECT/libs/operations` exposing two subpath modules — `/model` (operation types and factories; operations conform to the `Message` interface of `@art-lib/logger`) and `/log` (append-only operations log, created with the logger and forwarding every operation to it) — with tests, package records, and docs mirroring `libs/fs-records` conventions. Consumer adoption landed at `72537ab` as an adapter; the reopened scope adds the factory extension, the `0.0.2` release, and the conformance of `$WORKSPACE/checkouts/art-works/cli/workspace` to the shared model. Adoption in `@art-md/bin` remains out of scope.

### (Scope) Package: Art Lib Operations

**Record:** `$PROJECT/libs/operations/_records/package.art`

**Role:** — Changes required.

**Partial:**

- `owner` — Project: Art Lib
- `path` — `libs/operations`
- `canonicalName` — `@art-lib/operations`
- `deployment` — NPM Package Deployment: Art Lib Operations

**Changes:**

— Extend the three model factories with `<D>` generics and a `message?` hook (Iteration: Extend Operation Factory).
— Publish `@art-lib/operations@0.0.2` carrying the extension (Iteration: Publish Operations 0.0.2).
— Consume the released API in the consumer (Iteration: Conform CLI Operations, scoped to `$WORKSPACE/checkouts/art-works/cli/workspace`).

**Operations:**

— Run package and workspace verification (`npm run ci`, exit 0, zero `✘ [ERROR]`) before each commit.

**Dependencies:**

- None.

## Execution Context

Execution occurs from `$WORKSPACE/`; package work, its test suite, and the release happen in `$WORKSPACE/checkouts/art-lib/libs/operations/` on branch `main` — commits are `NOPUSH`, pushed by the user. The consumer conformance runs in `$WORKSPACE/checkouts/art-works/cli/workspace/` on branch `main`, with exactly one `npm run ci` per verification.

## Work

### Next

- Pair session executes `extend-operation-factory` → `conform-cli-operations` (both `WORKING`, verified together through the symlink) and runs `publish-operations-0-0-2` LAST, re-pinning the consumer to `0.0.2` after it lands — all commits `NOPUSH`, the user pushes. Plan stays in `_backlog/3-now/` until all three land; the architect then closes it (moves to `1-done`), refreshes the milestone, and records the workspace-records move.

### Blockers

- **Publish Operations Package** — step-1 precondition expects `npm view @art-lib/logger version` to return `0.0.1`, but the registry returns `0.0.2`: Plan: Add Logger Package published out of order (commits `36189e0`, `296e359`) mid-run. Evidence: `npm whoami` = `noodlestan` ✓; `npm view @art-lib/operations version` = ENOTFOUND ✓; pinned dep `@art-lib/logger@0.0.1` remains installable (nested in `libs/operations/node_modules`). Awaiting architect ruling: waive to "dependency resolvable on registry" or amend the precondition. **RESOLVED** — precondition amended per architect ruling (A) in commit `plan(add-operations): Amend it6 preconditions after logger 0.0.2 and policy move.`
- **Publish Operations Package** — step-1 manifest-conformance reference `$WORKSPACE/checkouts/management/_ops/packages/policy.md` does not exist (management now cloned; `_ops/` holds `conventions/`, `keywords/`, `writing/` only). The actual Package Manifest Policy is `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md`. RELEVANT plan update — architect-owned ref fix required before delegating this iteration. **RESOLVED** — ref amended per architect ruling (A) in commit `plan(add-operations): Amend it6 preconditions after logger 0.0.2 and policy move.`
- **Integrate in Consumer (paused)** — pre-it7 activity check found an active delegation in `$WORKSPACE/checkouts/art-works`: Plan: Make Art Workspace Cli work from global install (`art-work-cli-global-install`) is `WORKING`, iteration `discover-config-location` is `WORKING` (delegated 2026-11-06 03:44Z, instructions file fresh), with `add-init-command` and `update-art-work-knowledge` queued behind it. it7 paused per directive until that delegation integrates. Logger's `Update Cli Output Flag` is `READY` — not started. **Re-check 2026-11-06 11:42+0100: still active** — worker landed `1123faa`/`ac0337a`/`e0fbe90`, report `discover-config-location__report.md` + plan edit still uncommitted (pending integration), and the delegator landed `32bd0f8` pre-aligning `add-init-command` instructions (11:42) — a 5-minute poll never showed a clear window. it7 remains paused. **RESOLVED** — window granted by the architect; it7 executed under ruling (option 2), commit `72537ab`.
- **Integrate in Consumer (blocked — spec conflict)** — window granted (pre-flight `17d6629` ✓, tree clean); worker stopped BEFORE any file change: the package contract and "behaviour identical" cannot both hold as written. (a) Package model requires `ts: number` + `level`/`text()`; the 8 command builders emit `ts: new Date()` with neither → `tsc` fails if `types.ts` re-exports package types. (b) Package `createOperationsLog(logger)` requires the logger; local tests call it bare (optional no-op). (c) Package factories drop the CLI's `checkout` field and change `message()`/`errorSerialized()` semantics → `presentOperationsReport.test.ts` output columns change, violating "behaviour identical". Art-works untouched, `17d6629` == origin, single CI window unspent. Two options escalated: (1) edit builders + callers to package contract, accept output changes; (2) adapter — owned files delegate to the package while keeping CLI semantics (identical output, builders in place, types stay CLI-shaped). Awaiting architect pick. **RESOLVED** — architect picked (2) with constraint amendment (tests green without assertion changes, byte-identical output, tsc/eslint green, builders editable only as delegation requires); it7 executed as the adapter, commit `72537ab`, all constraints held.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/setting-up.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
npm run ci # to verify build is green before starting
```

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$PROJECT` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.

2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

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

## Items:

| Iteration / Instructions                | Status    |
| --------------------------------------- | --------- |
| Iteration: Scaffold Operations Package  | `DONE`    |
| Iteration: Implement Operations Model   | `DONE`    |
| Iteration: Implement Operations Log     | `DONE`    |
| Iteration: Apply Noodlestan Conventions | `DONE`    |
| Iteration: Update Knowledge             | `DONE`    |
| Iteration: Publish Operations Package   | `DONE`    |
| Iteration: Integrate in Consumer        | `DONE`    |
| Iteration: Extend Operation Factory     | `WORKING` |
| Iteration: Publish Operations 0.0.2     | `READY`   |
| Iteration: Conform CLI Operations       | `WORKING` |

### Iteration: Scaffold Operations Package

**Id:** `scaffold-operations-package`

**Status:** `DONE`

**Purpose:** Create the `operations` package skeleton with subpath exports before adding modules.

**Description:** Scaffold `$PROJECT/libs/operations` mirroring `libs/fs-records` conventions: `package.json` with `exports` for `.`, `./model`, and `./log`; tsconfig; vitest config; npm scripts; `_guide.md`; `_records/package.art`; empty module directories with `index.ts` entry points.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$PROJECT/libs/operations`

- Create `package.json` — name `@art-lib/operations`, exports map with `.`, `./model`, `./log` subpaths, dependency `@art-lib/logger`, scripts mirroring `libs/fs-records`.
- Create `tsconfig.json` and vitest config extending the monorepo configs.
- Create `src/index.ts`, `src/model/index.ts`, `src/log/index.ts` as placeholder entry points.
- Create `_guide.md` describing the package, subpath modules, and operating instructions.
- Create `_records/package.art` mirroring `libs/fs-records/_records`.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

**GATE — do not start if the gate has not lifted:** this iteration requires `@art-lib/logger` to exist — Plan: Add Logger Package, Iteration: Scaffold Logger Package must be `DONE`. If `$PROJECT/libs/logger` is missing, REPORT A BLOCKER with "logger package not scaffolded yet" and STOP.

Execute the Changes listed above, mirroring `libs/fs-records` conventions.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.

Validate that:

- `package.json` carries the name `@art-lib/operations`, the root export `./src/index.ts`, and dependency `@art-lib/logger`.
- No `node_modules` directory is created inside `$PROJECT/libs/operations`.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/operations/`.
- Commit `scaffold-operations` with the blueprint message below.

**Dependencies:**

- Plan: Add Logger Package, Iteration: Scaffold Logger Package — the manifest depends on `@art-lib/logger`.

#### Commits:

| ID                    | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| --------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `scaffold-operations` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `cbf34d6` | `COMMITTED` |

##### Commit: `scaffold-operations`

**Message:**

```text
scaffold(operations): Scaffold package with subpath exports.

- Create the manifest exporting `.`, `./model`, and `./log` with the `@art-lib/logger` dependency.
- Add `_guide.md`, `_records/package.art`, and placeholder module entry points.
```

### Iteration: Implement Operations Model

**Id:** `implement-operations-model`

**Status:** `DONE`

**Report:** `./plan-add-operations/instructions/implement-operations-model__report.md`

**Purpose:** Add the pure operation outcome model and factories shared by all CLIs.

**Description:** Implement `src/model/` with `OperationOutcome`, `OperationBase`, `OperationPending`, `OperationSuccess`, `OperationFailure`, `createGenericOperation()`, `createOperationSuccess()`, and `createOperationFailure(pending, error, options?)` supporting an optional `{ label }` (replaces Art Works' hardcoded `errorLabels` map). Export from `src/model/index.ts` and the root. Unit tests.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./plan-add-operations/instructions/implement-operations-model.md`

**Changes:**

In `$PROJECT/libs/operations/src/model/`

- `types.ts` — `OperationOutcome`, `OperationBase { operation, ts, finishedTs?, outcome, message(), timing() }`, `OperationPending` (adds `data?`), `OperationSuccess`, `OperationFailure` (adds `error`, `errorSerialized()`).
- `createGenericOperation.ts` — `createGenericOperation(operation, data?): OperationPending`.
- `createOperationSuccess.ts` — `createOperationSuccess(pending, message?): OperationSuccess`.
- `createOperationFailure.ts` — `createOperationFailure(pending, error, options?: { label?: string }): OperationFailure`.
- `types.ts` conformance members — `level` (derived from the outcome: pending → `debug`, success → `info`, failure → `error`) and `text()` (aliases `message()`) on `OperationBase`, so operations satisfy `Message` of `@art-lib/logger` structurally.
- `types.test.ts` / factory tests — outcomes, timing, label application.
- Update `src/index.ts` and `src/model/index.ts` exports.

**Dependencies:**

- Iteration: Scaffold Operations Package.

#### Commits:

| ID                     | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ---------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `add-operations-model` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `058f194` | `COMMITTED` |

##### Commit: `add-operations-model`

**Message:**

```text
build(operations): Add operation model and factories.

- Add outcome types and pending/success/failure factories with optional error labels.
- Export the pure model from the `./model` subpath and the package root.
```

### Iteration: Implement Operations Log

**Id:** `implement-operations-log`

**Status:** `DONE`

**Report:** `./plan-add-operations/instructions/implement-operations-log__report.md`

**Purpose:** Add the append-only operations log, created with the logger and forwarding every operation to it.

**Description:** Implement `src/log/` with `OperationsLog { log(op), all(), since(ts), latest(n) }` and `createOperationsLog(logger, options?)`. Every recorded operation is forwarded to `logger.log(...)`; pending operations pass through to the logger but only finished operations are stored. Operations conform to the `Message` interface of `@art-lib/logger` (level derived from the outcome). Export and unit test.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./plan-add-operations/instructions/implement-operations-log.md`

**Changes:**

In `$PROJECT/libs/operations/src/log/`

- `types.ts` — `OperationsLog` interface.
- `createOperationsLog.ts` — `createOperationsLog(logger, options?): OperationsLog`; forwards every operation to `logger.log`; stores finished ops only; `since`/`latest` query semantics.
- `createOperationsLog.test.ts` — storage filter, queries, forwarding to the logger.
- Update `src/index.ts` and `src/log/index.ts` exports.

**Dependencies:**

- Iteration: Implement Operations Model.
- Plan: Add Logger Package, Iteration: Implement Buffering Logger.

#### Commits:

| ID                   | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| -------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `add-operations-log` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `6de5369` | `COMMITTED` |

##### Commit: `add-operations-log`

**Message:**

```text
build(operations): Add operations log module.

- Add `createOperationsLog(logger)` forwarding every operation to the logger.
- Store finished operations only; cover `since` and `latest` queries with tests.
```

### Iteration: Apply Noodlestan Conventions

**Id:** `apply-noodlestan-conventions`

**Status:** `DONE`

**Purpose:** Align `libs/operations` with the Noodlestan conventions adopted in this workspace.

**Description:** Audit the package against the conventions declared in `$PROJECT/_guide.md` (TypeScript, unit tests) using the `manage-conventions` skill, install what is missing, and resolve the findings — without changing the package behaviour. Commit as `style(operations): Apply Noodlestan conventions.`

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$PROJECT/libs/operations`

- Discover, install, and audit the conventions applicable to the package with the `manage-conventions` skill.
- Resolve findings: package scripts, tsconfig, lint/test wiring, and convention-mandated files.
- Declare newly installed conventions in `$PROJECT/_guide.md` under `## Conventions`.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above, keeping the package behaviour identical.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.

Validate that:

- Every convention that applies to the package is installed and its findings are resolved.
- `npm run ci` passes from the `$WORKSPACE` root.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/operations/`.
- The commit `apply-conventions-operations` has policy `MANUAL` — stage the changes, report back with the proposed commit message; do not commit.

**Dependencies:**

- Iteration: Implement Operations Log.

#### Commits:

| ID                             | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ------------------------------ | ------------------------------ | -------- | --------- | ----------- |
| `apply-conventions-operations` | Art Lib / `$PROJECT` / `main`  | `MANUAL` | `b0643e1` | `COMMITTED` |

##### Commit: `apply-conventions-operations`

**Message:**

```text
style(operations): Apply Noodlestan conventions.

- Adopt the conventions that apply to the package and resolve audit findings.
```

### Iteration: Update Knowledge

**Id:** `update-knowledge`

**Status:** `DONE`

**Purpose:** Publish the package knowledge base and wire `@art-lib/operations` into the repository artefacts.

**Description:** Add a consumer-facing README and a package knowledge base, then update the repository knowledge, project record, and guide to list the package and link its knowledge. Commit as `docs(operations): Add package knowledge base and README usage.`

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

- `$PROJECT/libs/operations/README.md` — consumer-facing `## Usage` following the pattern of `$WORKSPACE/checkouts/workspace-tooling/cli/esbuild-cli/README.md`: what it is, install, configure, example, options.
- `$PROJECT/libs/operations/knowledge/` — package knowledge base following `$WORKSPACE/checkouts/art-md/cli/bin/knowledge`: at least `index.md`, `overview.md`, and `design/operations.md`; add `adr/` records where decisions exist.
- `$PROJECT/libs/operations/_guide.md` — reference the local knowledge base (`knowledge/index.md`).
- `$PROJECT/knowledge/components.md` — move the Operations entry to `IMPLEMENTED` and link its package knowledge.
- `$PROJECT/knowledge/index.md` — add a Package Knowledge References row linking `libs/operations/knowledge/index.md` (see `$WORKSPACE/checkouts/art-md/knowledge/index.md`).
- `$PROJECT/_records/project.art` — add `- Package: Art Lib Operations` to Resources.
- `$PROJECT/_guide.md` — list the package under the repository layout and its knowledge base under Knowledge References.
- Keep `$PROJECT/knowledge/design/operations.md` as the repository-level design record.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.

Validate that:

- The package knowledge links resolve and the README `## Usage` is self-sufficient for a new consumer.
- Every repository reference lists the package: `knowledge/index.md`, `knowledge/components.md`, `_records/project.art`, `_guide.md`.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/operations/`.
- Commit `update-knowledge-operations` with the blueprint message below.

**Dependencies:**

- Iteration: Apply Noodlestan Conventions.

#### Commits:

| ID                            | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ----------------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `update-knowledge-operations` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `cf61657` | `COMMITTED` |

##### Commit: `update-knowledge-operations`

**Message:**

```text
docs(operations): Add package knowledge base and README usage.

- Add the package knowledge base, a consumer-facing README, and repository references.
- Link the package knowledge from the repository knowledge index.
```

### Iteration: Publish Operations Package

**Id:** `publish-operations-package`

**Status:** `DONE`

**Purpose:** Publish `@art-lib/operations@0.0.1` to the public registry and record the deployment, lifting `Integrate in Consumer`'s gate.

**Description:** Publish the first version and flip both records to their deployed state. No version bump and no CHANGELOG edit are needed — this is the first publish, `version` will be `0.0.1`, and `CHANGELOG.md` documents `## 0.0.1`. The release commit therefore carries only the record updates, the same shape as `release(fs-records): 0.0.3`, which carried the state change rather than code. Added after `Iteration: Update Knowledge`, mirroring `Plan: Add Config Package`'s `publish-config-package`, so `Integrate in Consumer` has a gate it can actually lift.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

1. Verify every publish precondition **before** touching the registry. Any failure is a `REPORT A BLOCKER`, not something to work around:
   - `npm whoami` returns an account permitted to publish `@art-lib/*` (currently `noodlestan`).
   - `npm view @art-lib/operations version` fails with `ENOTFOUND` — `0.0.1` must not already exist. A published version is immutable, so a mistake requires a bump and a new publish.
   - `npm view @art-lib/logger@0.0.1 version` returns `0.0.1` — the manifest pins `@art-lib/logger@0.0.1`, and that exact version must be installable from the registry before this package ships. (Latest may be higher — logger `0.0.2` published at `296e359` after this plan was written; consumers resolve the pin, not the latest.)
   - `$PROJECT/libs/operations/package.json` carries `version` `0.0.1`, `private` `false`, `publishConfig` `{ "access": "public" }`, and `files` listing `dist`, `README.md`, `LICENSE-MIT`, `CHANGELOG.md`.
   - All four `files` entries exist on disk, and the manifest conforms to `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md`.
2. `npm pack --dry-run` from `$PROJECT/libs/operations`, and confirm the tarball contains `package.json`, `dist/index.mjs`, `dist/index.d.ts`, `README.md`, `LICENSE-MIT`, and `CHANGELOG.md`.
3. `npm publish --access public` from `$PROJECT/libs/operations`. If the registry demands a one-time password for two-factor authentication, **do not retry and do not unpublish** — `REPORT A BLOCKER` that publishing requires an OTP and stop.
4. Confirm the publish landed: `npm view @art-lib/operations version` returns `0.0.1`, `npm view @art-lib/operations dependencies` shows `@art-lib/logger`, and the description, keywords, and `engines` match `_records/package.art`.
5. Update both records to the deployed state:
   - `$PROJECT/libs/operations/_records/package.art` — `**Published:**` from `false` to `true`.
   - `$PROJECT/libs/operations/_records/npm-deployment.art` — `**Status:**` from `PLANNED` to `DEPLOYED`.
6. Do not change `version` or `CHANGELOG.md`.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above.

**This iteration publishes a public and immutable artefact.** Treat the step-1 preconditions as hard stops: if any fails, `REPORT A BLOCKER` and do not attempt a workaround. Never unpublish.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.
- Read `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md` — the manifest must already conform before it ships.

Validate that:

- The registry serves `@art-lib/operations@0.0.1` with the expected `description`, `keywords`, `engines`, and `dependencies`.
- Both records reflect the deployed state: `_records/package.art` `Published` `true`, `_records/npm-deployment.art` `Status` `DEPLOYED`.
- `version` and `CHANGELOG.md` are untouched.
- `npm run ci` still passes from the `$WORKSPACE` root.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/operations/`.
- Commit `publish-operations` with the blueprint message below.

**Dependencies:**

- Iteration: Update Knowledge — the published package must ship the README its registry listing and consumers reference.
- Plan: Add Logger Package, Iteration: Publish Logger Package — `@art-lib/logger` must be on the registry first.

#### Commits:

| ID                   | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| -------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `publish-operations` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `4bf2da2` | `COMMITTED` |

##### Commit: `publish-operations`

**Message:**

```text
release(operations): Publish 0.0.1 to npm.

- Record the first publish: `Published` true, deployment `DEPLOYED`.
```

### Iteration: Integrate in Consumer

**Id:** `integrate-in-consumer`

**Status:** `DONE`

**Purpose:** Adopt `@art-lib/operations` in the Art Workspace Cli and retire its duplicated implementation.

**Description:** Refactor `$WORKSPACE/checkouts/art-works/cli/workspace` to consume `@art-lib/operations`, keeping CLI-specific conventions on the CLI side. Commit in the Art Works repository as `refactor(workspace-cli): Adopt @art-lib/operations in the Workspace Cli.`

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$WORKSPACE/checkouts/art-works` (Art Works repository)

- `cli/workspace/package.json` — declare `@art-lib/operations` the way `@art-lib/fs-records` is declared.
- `cli/workspace/src/private/operations/` — replace `types.ts`, `createGenericOperation.ts`, `createOperationSuccess.ts`, and `createOperationFailure.ts` with the `@art-lib/operations` model; keep the command-specific builders under `src/private/commands/operations/`.
- `cli/workspace/src/private/log/createOperationsLog.ts` — replace with `createOperationsLog` from `@art-lib/operations/log`.
- Update callers and test helpers; keep the operations output identical.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

**GATE — do not start until the package is consumable:** `Iteration: Publish Operations Package` must be `DONE` and `@art-lib/operations@0.0.1` must be installable from the Art Works checkout; verify it exposes the documented API before proceeding. The preceding iterations are a prerequisite only insofar as they produced what was published. This consumer-integration iteration is deliberately excluded from the gate. If the package is not yet available or the API is missing, REPORT A BLOCKER with "operations package not published/consumable yet" and STOP.

Execute the Changes listed above, keeping the CLI behaviour identical.

Before starting:

- Run `npm ci` from `$WORKSPACE/checkouts/art-works`.

Validate that:

- `npm run ci` passes from `$WORKSPACE/checkouts/art-works/cli/workspace`.
- The CLI behaviour is unchanged: the same inputs produce the same outputs.

After executing:

- Commit `integrate-operations-in-consumer` in the Art Works repository with the blueprint message below.

**Dependencies:**

- Iteration: Publish Operations Package.

#### Commits:

| ID                                 | Repository / Checkout / Branch                        | Policy       | Hash      | Status      |
| ---------------------------------- | ----------------------------------------------------- | ------------ | --------- | ----------- |
| `integrate-operations-in-consumer` | Art Works / `$WORKSPACE/checkouts/art-works` / `main` | `AUTONOMOUS` | `72537ab` | `COMMITTED` |

##### Commit: `integrate-operations-in-consumer`

**Message:**

```text
refactor(workspace-cli): Adopt @art-lib/operations in the Workspace Cli.

- Replace the local operations model, stores, and log with @art-lib/operations.
- Keep CLI behaviour and its test suite green.
```

### Iteration: Extend Operation Factory

**Id:** `extend-operation-factory`

**Status:** `WORKING`

**Purpose:** Make the package factories able to carry consumer-specific shape and messages, so consumers delegate fully instead of re-implementing `ts`, `outcome`, and `timing()`.

**Description:** Extends the three model factories with `<D>` generics and an optional `message?: (data: D) => string` hook on `createGenericOperation` — the default preserves today's `readInputUri(data)` semantics so every existing test stays green. Adds the `UNRELEASED` changelog entry for the change. Unblocks Iteration: Conform CLI Operations: the eight CLI constructors become one-line delegations carrying `checkout` in `D`.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$PROJECT/libs/operations`

- `src/model/createGenericOperation.ts` — signature `createGenericOperation<D>(name: string, data: D, message?: (data: D) => string): OperationPending<D>`; default message preserves `readInputUri(data)` behaviour; pending `timing()` stays `NaN`; keep `Object.freeze`.
- `src/model/createOperationSuccess.ts` — `createOperationSuccess<D>(pending: OperationPending<D>, message?: string): OperationSuccess<D>`.
- `src/model/createOperationFailure.ts` — `createOperationFailure<D>(pending: OperationPending<D>, error: unknown, options?: { label?: string }): OperationFailure<D>`.
- Export surface unchanged — same three names, back-compatible with `@art-lib/operations@0.0.1` consumers.
- Tests: add cases for the typed `data` round-trip and the custom message hook; do not modify existing assertions.
- `CHANGELOG.md` — add `## UNRELEASED` above `## 0.0.1` with an `### Added` bullet describing the extended factories.
- Verify: package `npm run ci` and workspace `npm run ci` — exit 0, zero `✘ [ERROR]`.

**Instructions:**

Execute the Changes listed above. This iteration is worked in the pair session (art-lib side) — report in chat, no separate delegation record.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root (Operating Instructions: Setting Up).

Validate that:

- All three factories are generic over `D`, and `data` flows type-preserving into success and failure.
- Default-message behaviour is unchanged (existing `createGenericOperation` tests untouched and green).

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section.
- Commit `extend-operation-factories` with the blueprint message below — policy `NOPUSH`: create the commit, do NOT push.

**Dependencies:**

- None.

#### Commits:

| ID                           | Repository / Checkout / Branch | Policy   | Hash    | Status     |
| ---------------------------- | ------------------------------ | -------- | ------- | ---------- |
| `extend-operation-factories` | Art Lib / `$PROJECT` / `main`  | `NOPUSH` | `(TBD)` | `AUTHORED` |

##### Commit: `extend-operation-factories`

**Message:**

```text
build(operations): Extend model factories with generics and a message hook.

- Type the three factories over `D` and accept a custom message, defaulting to current behaviour.
```

### Iteration: Publish Operations 0.0.2

**Id:** `publish-operations-0-0-2`

**Status:** `READY`

**Purpose:** Ship the extended factory API as `@art-lib/operations@0.0.2` so the consumer conformance consumes it from the registry.

**Description:** Bumps `version` 0.0.1 → 0.0.2, promotes the `UNRELEASED` entry to `0.0.2`, and publishes — the same release shape as `@art-lib/config@0.0.2`. No record flips: the package is already `Published: true` / `DEPLOYED`, so the release commit carries only `package.json` + `CHANGELOG.md`. Preconditions apply to the new version; on failure, `REPORT A BLOCKER` — never unpublish.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$PROJECT/libs/operations`

1. Verify every precondition **before** touching the registry — any failure is `REPORT A BLOCKER`, not something to work around:
   - `npm whoami` returns `noodlestan`.
   - `npm view @art-lib/operations version` returns `0.0.1`; `0.0.2` must not exist (a published version is immutable).
   - `package.json` carries `version` `0.0.1` before the bump, `private` `false`, `publishConfig` `{ "access": "public" }`, and `files` listing `dist`, `README.md`, `LICENSE-MIT`, `CHANGELOG.md` — all four on disk.
2. Bump `version` to `0.0.2`; promote `## UNRELEASED` to `## 0.0.2` in `CHANGELOG.md`. Touch nothing else.
3. `npm pack --dry-run` — tarball contains `package.json`, `dist/index.mjs`, `dist/index.d.ts`, `README.md`, `LICENSE-MIT`, `CHANGELOG.md`.
4. `npm publish --access public`. On OTP/2FA demand: `REPORT A BLOCKER`, do not retry, never unpublish.
5. Confirm: `npm view @art-lib/operations version` returns `0.0.2`; `dependencies` still shows `@art-lib/logger`; `description`/`keywords`/`engines` match `_records/package.art`.
6. Run workspace `npm run ci` — exit 0, zero `✘ [ERROR]`.

**Instructions:**

Execute the Changes listed above. This iteration is worked in the pair session — report in chat, no separate delegation record.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root (Operating Instructions: Setting Up).
- Iteration: Extend Operation Factory must be `DONE` — its changes are what this release ships.

Validate that:

- The registry serves `@art-lib/operations@0.0.2` with the expected metadata.
- `version` and the promoted `0.0.2` changelog section are the only content changes.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section.
- Commit `publish-operations-0-0-2` with the blueprint message below — policy `NOPUSH`: create the commit, do NOT push.

**Dependencies:**

- Iteration: Extend Operation Factory — the release ships the extended factories.

#### Commits:

| ID                         | Repository / Checkout / Branch | Policy   | Hash    | Status     |
| -------------------------- | ------------------------------ | -------- | ------- | ---------- |
| `publish-operations-0-0-2` | Art Lib / `$PROJECT` / `main`  | `NOPUSH` | `(TBD)` | `AUTHORED` |

##### Commit: `publish-operations-0-0-2`

**Message:**

```text
release(operations): Publish 0.0.2 to npm.

- Promote the `UNRELEASED` entry to `0.0.2` and publish the factory extension.
```

### Iteration: Conform CLI Operations

**Id:** `conform-cli-operations`

**Status:** `WORKING`

**Purpose:** Retire the parallel type system in the consumer — conform `cli/workspace` to the package model with `checkout` carried in `D`, keeping report output byte-identical.

**Description:** The adoption at `72537ab` kept both type systems: five duplicated generic types, `Date` vs epoch timestamps, base-level `checkout`, `as unknown as` casts in the log wrapper, and `toSharedPending.ts` — a converter that exists only because the two models disagree. This iteration implements the accepted conformance: local generics are replaced by the package's, the eight payloads become `D` members (each carrying `checkout`), builders delegate timing and shape to the extended factories, the report reads `op.data?.checkout`, and `toSharedPending.ts` is deleted.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$WORKSPACE/checkouts/art-works/cli/workspace`

- `src/private/operations/types.ts` — delete `OperationOutcome`, `OperationBase`, `OperationPending`, `OperationSuccess`, `OperationFailure`; import them from `@art-lib/operations/model` instead. Keep `CheckoutOp` and `Operation`, and keep only the eight operation payloads as `XxxData` (own fields + `checkout?: Checkout`), e.g. `type PullPending = OperationPending<PullData> & { operation: 'pull' }`.
- `src/private/commands/operations/*.ts` (8 constructors) — one-line delegations to `createGenericOperation(name, data, message)`; drop `ts: new Date()`, `outcome: 'pending'`, and the copy-pasted `timing()` — the package owns all three.
- `src/private/operations/createGenericOperation.ts`, `createOperationSuccess.ts`, `createOperationFailure.ts` — thin re-exports of the package's (or delete and import directly, where lint allows); the epoch→`Date` conversions (`new Date(shared.finishedTs ?? Date.now())`) die with them.
- `src/private/operations/toSharedPending.ts` — DELETE.
- `src/private/log/createOperationsLog.ts` — delegate to the package's factory; remove both `as unknown as` casts and the hand-rolled interface; `since` follows the package contract (epoch), callers updated.
- `src/private/present/presentOperationsReport.ts` — read `op.data?.checkout`; the six headers and every rendered value stay exactly as today.
- Timestamps: epoch milliseconds everywhere; `timing()` arithmetic lives in the package (`finishedTs - ts`).
- **Logger injection — orientation, not pre-decided:** tests that call `createOperationsLog()` bare must inject a logger. Check first whether `@art-lib/logger` exposes a usable test util, or whether `createLogger` with a no-op/in-memory writer suffices (its exports today: `createLogger`, message factories, types — no dedicated mock). Note `@art-lib/operations` carries an internal `createLoggerMock` under `src/test/helpers/logger/` (not exported) and art-works has its own `test/helpers/`. Pick the cleanest source and report the choice.
- **HARD GATE:** `src/private/present/presentOperationsReport.test.ts` passes with its EXISTING expectations — same six columns, same values. If conformance forces a single assertion change, `REPORT A BLOCKER` instead of editing it. Call-site updates in other tests are permitted; assertion changes are not.
- Verify: `npm run ci` from the art-works repo root — exit 0, zero `✘ [ERROR]`, tsc/eslint/prettier green.

**Instructions:**

Execute the Changes listed above. This iteration is worked in the pair session (art-works side) — report in chat, no separate delegation record.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root; consume `@art-lib/operations@0.0.2` from the registry — Iteration: Publish Operations 0.0.2 must be `DONE`.
- Read the HARD GATE above first: output parity is the acceptance criterion, not type parity.

Validate that:

- No local declaration of the five generic types remains; no `as unknown as` cast remains under `src/private/operations|log`; `toSharedPending.ts` is gone.
- All 8 constructors delegate to the package factory (no local `timing()` implementations remain).
- The report test passes with untouched assertions.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section.
- Commit `conform-operations-model` with the blueprint message below — policy `NOPUSH`: create the commit, do NOT push.

**Dependencies:**

- Iteration: Publish Operations 0.0.2 — consumes the extended factory API from the registry. Executed pre-publish during the pair session through the local symlink (see Decisions); the registry consume requirement is re-checked after the release re-pins the consumer.

#### Commits:

| ID                         | Repository / Checkout / Branch                        | Policy   | Hash    | Status     |
| -------------------------- | ----------------------------------------------------- | -------- | ------- | ---------- |
| `conform-operations-model` | Art Works / `$WORKSPACE/checkouts/art-works` / `main` | `NOPUSH` | `(TBD)` | `AUTHORED` |

##### Commit: `conform-operations-model`

**Message:**

```text
refactor(workspace-cli): Conform operations to the shared model types.

- Carry `checkout` in the generic data, adopt epoch timestamps, retire the parallel types.
```

---

## Coordination

### Not In Scope

- **Consumer adoption beyond Art Works** — `@art-works/workspace-cli` is the first consumer (Iteration: Integrate in Consumer); `@art-md/bin` migrates in its own project after this package publishes.
- **`cli-command-runner`, `cli-test-helpers`, `cli-present`** are rejected per the milestone decision; revisit triggers recorded as milestone follow ups.

### Evidence

- `@art-lib/operations` builds, lints, and tests green from `$PROJECT/libs/operations`; both subpaths resolve via the exports map.
- **Scaffold landed** — worker reported commit `cbf34d6` (pushed): manifest with `.`, `./model`, `./log` exports and `@art-lib/logger` dep, configs, placeholder entry points, `_guide.md`, records; package + workspace CI green; no `node_modules` inside the package.
- **Model landed** — worker reported commit `058f194` (pushed): `src/model/` types + factories, 15 tests (100% coverage), `Message` conformance type-test; lint/build/test green, no storage code; report at `instructions/implement-operations-model__report.md`.
- **Log landed** — worker reported commit `6de5369` (pushed): `createOperationsLog(logger)` forwarding + finished-only store, `all`/`since`/`latest` queries, 20 tests green; report at `instructions/implement-operations-log__report.md`.
- **Conventions applied** — worker commit `b0643e1` (pushed, `MANUAL` policy authorized by architect): 16 files under `libs/operations/src` restructured per conventions (model split into per-factory modules + `private/`, test helpers extracted); TypeScript + Unit Tests conventions already installed and declared in `$PROJECT/_guide.md` — no new installs, no guide edit needed; `model/index.ts` export surface unchanged from HEAD; package lint/build/test and workspace `npm run ci` exit 0.
- **Knowledge wired** — worker reported commit `cf61657` (pushed, rebased onto logger-plan commits): consumer README + package knowledge base (`index`/`overview`/`design`/`adr`), wired into `knowledge/index.md`, `knowledge/components.md` (`IMPLEMENTED`), `_records/project.art`, `_guide.md`; 23 local links resolve, lint/build/test + repo CI green.
- **Published** — `@art-lib/operations@0.0.1` on the registry (worker commit `4bf2da2`, pushed; records-only: `Published` `true`, deployment `DEPLOYED`): pack dry-run had all six required files (25 files), registry `version`/`dependencies` (`@art-lib/logger: 0.0.1`)/`description`/`keywords`/`engines` byte-identical to `_records/package.art`, no OTP, single attempt, nothing unpublished; workspace `npm run ci` + repo CI green. Anomaly (feedback): a `0.0.0-stage` placeholder appeared on the registry between precondition check and publish (same documented anomaly as the logger plan); sorts below `latest` `0.0.1`, left untouched per never-unpublish.
- **Adopted in the consumer** — worker commit `72537ab` (Art Works, pushed): adapter design — the five owned files delegate to `@art-lib/operations` (shared outcome/factory/log-store logic) with CLI conventions as thin wrappers (`Date` timestamps, `checkout`, JSON/reason messages, `since(Date)`); 8 files, declared paths only, zero test files touched (assertions unchanged), `@art-lib/operations@0.0.1` declared like `@art-lib/fs-records` (+13 lockfile lines); API resolution verified for `/`, `/model`, `/log`; exactly one manual `npm run ci` exit 0, zero `✘ [ERROR]` (hook CI also zero), tsc/eslint/prettier green; tree clean. Follow-up (their record, outside window): `cli/workspace/_records/package.art` dependency records do not yet list `@art-lib/operations`.
- **Iteration `extend-operation-factory` — code complete, uncommitted (pair session, art-lib):** `createGenericOperation<N extends string, D>(name, data?, text?)` returns `OperationPending<D> & { operation: N }` (literal operation type; hook named `text` to align with `Message`); default text = new `private/formatData.ts` (JSON) replacing the deleted `readInputUri.ts`; `createOperationSuccess`/`createOperationFailure` generic over `D`; `types.ts`, the log (`createOperationsLog`, `log/types`), and `createLoggerMock` helpers updated; `createOperation.test.ts` +68 covering generics and the hook; `CHANGELOG.md` gains `## UNRELEASED` with the `### Added` bullet; knowledge synced (README, package `knowledge/adr|design|overview`, root `knowledge/design/operations.md` — design record −96 lines to the new API).
- **Iteration `conform-cli-operations` — code complete, uncommitted (pair session, art-works, via symlink):** five local generics removed (`operations/types.ts` −99); the 8 constructors are one-line `createGenericOperation('op', { …, checkout }, () => …)` delegations (e.g. pull: `return createGenericOperation('pull', { branch, checkout }, () => \`from origin/${branch}\`)`); `toSharedPending.ts`, `createGenericOperation.ts(+test)`, `createOperationSuccess.ts(+test)`deleted;`createOperationFailure.ts`and`createOperationsLog.ts`reduced to thin delegations (both`as unknown as`casts gone); the report reads`checkout`from`op.data`via new`present/private/readCheckout.ts`and renders`op.text()`; ~40 callers/tests updated to epoch timestamps and `text()`; `presentOperationsReport.test.ts`fixture switched to the package factory — **assertions untouched, HARD GATE holds pending the run**; knowledge`_pseudo.md`/`operations-log.md` synced.

### Findings

- The Art MD proposal (`_backlog/_message-from-art-md-project.md`, since deleted) showed ~60% identical CLI plumbing across `@art-works/workspace-cli` and `@art-md/bin`; packages 1–3 of the proposal are merged into this single package (logger split out again per the milestone decision).
- The operations log is intentionally created with the logger (`createOperationsLog(logger, options?)`) and forwards every operation to it — one-way dependency, operations → logger.

### Decisions

- One package with two subpath modules (`/model`, `/log`) — not three published packages; ~185 lines of total dedup does not justify separate version surfaces.
- The buffering logger is split out into the planned `@art-lib/logger` package (effectful, wraps the log writer).
- Operations conform to the logger's `Message` interface (level derived from outcome); the logger never knows about operations.
- `createOperationFailure` takes `{ label }` per call — replaces Art Works' hardcoded `errorLabels` map.
- **Symlink-first execution** — the pair runs iterations 1 → 3 together through `node_modules/@art-lib/operations → ../../../art-lib/libs/operations`, deferring `publish-operations-0-0-2` to last; after the release, the consumer re-pins `@art-lib/operations` to `0.0.2` and `npm ci` retires the symlink.

### Knowledge to Update

- Keep the `operations` package entry in `knowledge/components.md` in sync after scaffolding.

### Follow Ups

- `@art-works/workspace-cli` adoption is planned here (Iteration: Integrate in Consumer); `@art-md/bin` migrates in its own project.
- Revisit `cli-command-runner` when a third CLI exists; dedup temp-dir test helpers as a later chore (milestone follow ups).

### Feedback

- **IRRELEVANT updates (recorded by Prepare Delegation, apply on next architect edit)** — (1) `### Blockers` renders `- None.` while `plan.tart` omits the section when empty; (2) no `## Execution Context` section rendered; (3) no `## Resource Kinds in Scope` section rendered; (4) `## Scope` is prose without the structured record/role/changes shape; none of these change what a worker reads, changes, or commits.
- **Blueprint divergence (delegation follows the instruction files verbatim)** — plan Commit blueprints for `add-operations-model` and `add-operations-log` differ in message text from the self-contained instruction files ("Add operation model and factories." vs "Add immutable operations model."; "Add operations log module." vs "Add operations log store and queries."). Delegation executes the instruction files; sync the plan blueprints on integration review.
