# Plan: Add Operations Package

**ID:** `add-operations`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Provide the shared CLI operation model and operations log extracted from the Art Work CLI and the Art MD codec bin.

**Description:** Create the `@art-lib/operations` package with two subpath modules — `/model` (operation types and factories) and `/log` (append-only operations log) — replacing duplicated plumbing in both CLIs. The buffering logger lives in the planned `@art-lib/logger` package.

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

Create `@art-lib/operations` with subpath modules `/model` and `/log`, extracting the identical operation plumbing from `@art-work/cli` and `@art-md/bin`.

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

### Knowledge

::READ `$PROJECT/knowledge/design/operations.md` (Design) — Operation record contract and Operations Log semantics. Relevant for Planning Work Item.
::READ `$PROJECT/knowledge/index.md` (Model) — Package layout, publishing, and execution model. Relevant for Planning Work Item.

## Scope

Create `$PROJECT/libs/operations` exposing two subpath modules — `/model` (operation types and factories; operations conform to the `Message` interface of `@art-lib/logger`) and `/log` (append-only operations log, created with the logger and forwarding every operation to it) — with tests, package records, and docs mirroring `libs/fs-records` conventions. Adoption refactors in `@art-work/cli` and `@art-md/bin` are out of scope.

## Work

### Next

- Planning complete: all six iterations are `READY` with instructions. Delegate Iteration: Scaffold Operations Package (after Logger's package exists), Iteration: Implement Operations Model, Iteration: Implement Operations Log (after Logger's `Message` lands), Iteration: Apply Noodlestan Conventions (`MANUAL` commit), Iteration: Update Knowledge, then Iteration: Integrate in Consumer. Config and Logger may proceed independently.

### Blockers

- None.

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

| Iteration / Instructions                | Status  |
| --------------------------------------- | ------- |
| Iteration: Scaffold Operations Package  | `READY` |
| Iteration: Implement Operations Model   | `READY` |
| Iteration: Implement Operations Log     | `READY` |
| Iteration: Apply Noodlestan Conventions | `READY` |
| Iteration: Update Knowledge             | `READY` |
| Iteration: Integrate in Consumer        | `READY` |

### Iteration: Scaffold Operations Package

**Id:** `scaffold-operations-package`

**Status:** `READY`

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

| ID                    | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| --------------------- | ------------------------------ | ------------ | ------- | ---------- |
| `scaffold-operations` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `scaffold-operations`

**Message:**

```text
scaffold(operations): Scaffold package with subpath exports.

- Create the manifest exporting `.`, `./model`, and `./log` with the `@art-lib/logger` dependency.
- Add `_guide.md`, `_records/package.art`, and placeholder module entry points.
```

### Iteration: Implement Operations Model

**Id:** `implement-operations-model`

**Status:** `READY`

**Purpose:** Add the pure operation outcome model and factories shared by all CLIs.

**Description:** Implement `src/model/` with `OperationOutcome`, `OperationBase`, `OperationPending`, `OperationSuccess`, `OperationFailure`, `createGenericOperation()`, `createOperationSuccess()`, and `createOperationFailure(pending, error, options?)` supporting an optional `{ label }` (replaces Art Work's hardcoded `errorLabels` map). Export from `src/model/index.ts` and the root. Unit tests.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/implement-operations-model.md`

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

| ID                     | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| ---------------------- | ------------------------------ | ------------ | ------- | ---------- |
| `add-operations-model` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `add-operations-model`

**Message:**

```text
build(operations): Add operation model and factories.

- Add outcome types and pending/success/failure factories with optional error labels.
- Export the pure model from the `./model` subpath and the package root.
```

### Iteration: Implement Operations Log

**Id:** `implement-operations-log`

**Status:** `READY`

**Purpose:** Add the append-only operations log, created with the logger and forwarding every operation to it.

**Description:** Implement `src/log/` with `OperationsLog { log(op), all(), since(ts), latest(n) }` and `createOperationsLog(logger, options?)`. Every recorded operation is forwarded to `logger.log(...)`; pending operations pass through to the logger but only finished operations are stored. Operations conform to the `Message` interface of `@art-lib/logger` (level derived from the outcome). Export and unit test.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/implement-operations-log.md`

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

| ID                   | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| -------------------- | ------------------------------ | ------------ | ------- | ---------- |
| `add-operations-log` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `add-operations-log`

**Message:**

```text
build(operations): Add operations log module.

- Add `createOperationsLog(logger)` forwarding every operation to the logger.
- Store finished operations only; cover `since` and `latest` queries with tests.
```

### Iteration: Apply Noodlestan Conventions

**Id:** `apply-noodlestan-conventions`

**Status:** `READY`

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

| ID                             | Repository / Checkout / Branch | Policy   | Hash    | Status     |
| ------------------------------ | ------------------------------ | -------- | ------- | ---------- |
| `apply-conventions-operations` | Art Lib / `$PROJECT` / `main`  | `MANUAL` | `(TBD)` | `AUTHORED` |

##### Commit: `apply-conventions-operations`

**Message:**

```text
style(operations): Apply Noodlestan conventions.

- Adopt the conventions that apply to the package and resolve audit findings.
```

### Iteration: Update Knowledge

**Id:** `update-knowledge`

**Status:** `READY`

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

| ID                            | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| ----------------------------- | ------------------------------ | ------------ | ------- | ---------- |
| `update-knowledge-operations` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `update-knowledge-operations`

**Message:**

```text
docs(operations): Add package knowledge base and README usage.

- Add the package knowledge base, a consumer-facing README, and repository references.
- Link the package knowledge from the repository knowledge index.
```

### Iteration: Integrate in Consumer

**Id:** `integrate-in-consumer`

**Status:** `READY`

**Purpose:** Adopt `@art-lib/operations` in the Art Work CLI and retire its duplicated implementation.

**Description:** Refactor `$WORKSPACE/checkouts/art-work/cli/work` to consume `@art-lib/operations`, keeping CLI-specific conventions on the CLI side. Commit in the Art Work repository as `refactor(work): Adopt @art-lib/operations in the Work CLI.`

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$WORKSPACE/checkouts/art-work` (Art Work repository)

- `cli/work/package.json` — declare `@art-lib/operations` the way `@art-lib/fs-records` is declared.
- `cli/work/src/private/operations/` — replace `types.ts`, `createGenericOperation.ts`, `createOperationSuccess.ts`, and `createOperationFailure.ts` with the `@art-lib/operations` model; keep the command-specific builders under `src/private/commands/operations/`.
- `cli/work/src/private/log/createOperationsLog.ts` — replace with `createOperationsLog` from `@art-lib/operations/log`.
- Update callers and test helpers; keep the operations output identical.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

**GATE — do not start if the gate has not lifted:** this iteration requires the whole `@art-lib/operations` plan to be `DONE`, including the `MANUAL` conventions commit. If `$PROJECT/libs/operations` does not expose the landed API, REPORT A BLOCKER with "operations package not landed yet" and STOP.

Execute the Changes listed above, keeping the CLI behaviour identical.

Before starting:

- Run `npm ci` from `$WORKSPACE/checkouts/art-work`.

Validate that:

- `npm run ci` passes from `$WORKSPACE/checkouts/art-work/cli/work`.
- The CLI behaviour is unchanged: the same inputs produce the same outputs.

After executing:

- Commit `integrate-operations-in-consumer` in the Art Work repository with the blueprint message below.

**Dependencies:**

- Iteration: Update Knowledge.

#### Commits:

| ID                                 | Repository / Checkout / Branch                      | Policy       | Hash    | Status     |
| ---------------------------------- | --------------------------------------------------- | ------------ | ------- | ---------- |
| `integrate-operations-in-consumer` | Art Work / `$WORKSPACE/checkouts/art-work` / `main` | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `integrate-operations-in-consumer`

**Message:**

```text
refactor(work): Adopt @art-lib/operations in the Work CLI.

- Replace the local operations model, stores, and log with @art-lib/operations.
- Keep CLI behaviour and its test suite green.
```

---

## Coordination

### Not In Scope

- **Consumer adoption beyond Art Work** — `@art-work/cli` is the first consumer (Iteration: Integrate in Consumer); `@art-md/bin` migrates in its own project after this package publishes.
- **`cli-command-runner`, `cli-test-helpers`, `cli-present`** are rejected per the milestone decision; revisit triggers recorded as milestone follow ups.

### Evidence

- `@art-lib/operations` builds, lints, and tests green from `$PROJECT/libs/operations`; both subpaths resolve via the exports map.

### Findings

- The Art MD proposal (`_backlog/_message-from-art-md-project.md`, since deleted) showed ~60% identical CLI plumbing across `@art-work/cli` and `@art-md/bin`; packages 1–3 of the proposal are merged into this single package (logger split out again per the milestone decision).
- The operations log is intentionally created with the logger (`createOperationsLog(logger, options?)`) and forwards every operation to it — one-way dependency, operations → logger.

### Decisions

- One package with two subpath modules (`/model`, `/log`) — not three published packages; ~185 lines of total dedup does not justify separate version surfaces.
- The buffering logger is split out into the planned `@art-lib/logger` package (effectful, wraps the log writer).
- Operations conform to the logger's `Message` interface (level derived from outcome); the logger never knows about operations.
- `createOperationFailure` takes `{ label }` per call — replaces Art Work's hardcoded `errorLabels` map.

### Knowledge to Update

- Keep the `operations` package entry in `knowledge/components.md` in sync after scaffolding.

### Follow Ups

- `@art-work/cli` adoption is planned here (Iteration: Integrate in Consumer); `@art-md/bin` migrates in its own project.
- Revisit `cli-command-runner` when a third CLI exists; dedup temp-dir test helpers as a later chore (milestone follow ups).

### Feedback

- None.
