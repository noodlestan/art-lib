# Plan: Add Operations Package

**ID:** `add-operations`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Provide the shared CLI operation model and operations log extracted from the Art Work CLI and the Art MD codec bin.

**Description:** Create the `@art-lib/operations` package with two subpath modules — `/model` (operation types and factories) and `/log` (append-only operations log) — replacing duplicated plumbing in both CLIs. The buffering logger lives in the planned `@art-lib/logger` package.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                           | Purpose                               |
| ------------ | --------------------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory               | Workspace root directory              |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains`            | Domain resources directory            |
| `$PROJECT`   | `$WORKSPACE/checkouts/art-lib-planning` | Planning repository (upstream items). |
| `$ART_LIB`   | `$WORKSPACE/checkouts/art-lib-building` | Art Lib repository.                   |

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

::READ `$ART_LIB/knowledge/index.md` (Model) — Package layout, publishing, and execution model. Relevant for Planning Work Item.

## Scope

Create `$ART_LIB/libs/operations` exposing two subpath modules — `/model` (operation types and factories; operations conform to the `Message` interface of `@art-lib/logger`) and `/log` (append-only operations log, created with the logger and forwarding every operation to it) — with tests, package records, and docs mirroring `libs/fs-records` conventions. Adoption refactors in `@art-work/cli` and `@art-md/bin` are out of scope.

## Work

### Next

- Write instructions for the three `PLANNING` iterations, then delegate Iteration: Scaffold Operations Package. Sequencing: Iteration: Implement Operations Log runs after Plan: Add Logger Package has landed the `Message` interface.

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

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$ART_LIB` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.

2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/ops/verifying-completion.art`.

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

## Items:

| Iteration / Instructions               | Status     |
| -------------------------------------- | ---------- |
| Iteration: Scaffold Operations Package | `PLANNING` |
| Iteration: Implement Operations Model  | `PLANNING` |
| Iteration: Implement Operations Log    | `PLANNING` |

### Iteration: Scaffold Operations Package

**Id:** `scaffold-operations-package`

**Status:** `PLANNING`

**Purpose:** Create the `operations` package skeleton with subpath exports before adding modules.

**Description:** Scaffold `$ART_LIB/libs/operations` mirroring `libs/fs-records` conventions: `package.json` with `exports` for `.`, `./model`, and `./log`; tsconfig; vitest config; npm scripts; `_guide.md`; `_records/package.art`; empty module directories with `index.ts` entry points.

**Changes:**

In `$ART_LIB/libs/operations`

- Create `package.json` — name `@art-lib/operations`, exports map with `.`, `./model`, `./log` subpaths, dependency `@art-lib/logger`, scripts mirroring `libs/fs-records`.
- Create `tsconfig.json` and vitest config extending the monorepo configs.
- Create `src/index.ts`, `src/model/index.ts`, `src/log/index.ts` as placeholder entry points.
- Create `_guide.md` describing the package, subpath modules, and operating instructions.
- Create `_records/package.art` mirroring `libs/fs-records/_records`.

**Dependencies:**

- None.

#### Commits:

| ID                    | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| --------------------- | --------------------------------- | ------------ | ---- | ---------- |
| `scaffold-operations` | Art Lib / `$ART_LIB` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `scaffold-operations`

**Message:**

```text
scaffold(operations): Scaffold package with subpath exports.
```

### Iteration: Implement Operations Model

**Id:** `implement-operations-model`

**Status:** `PLANNING`

**Purpose:** Add the pure operation outcome model and factories shared by all CLIs.

**Description:** Implement `src/model/` with `OperationOutcome`, `OperationBase`, `OperationPending`, `OperationSuccess`, `OperationFailure`, `createGenericOperation()`, `createOperationSuccess()`, and `createOperationFailure(pending, error, options?)` supporting an optional `{ label }` (replaces Art Work's hardcoded `errorLabels` map). Export from `src/model/index.ts` and the root. Unit tests.

**Changes:**

In `$ART_LIB/libs/operations/src/model/`

- `types.ts` — `OperationOutcome`, `OperationBase { operation, ts, finishedTs?, outcome, message(), timing() }`, `OperationPending` (adds `data?`), `OperationSuccess`, `OperationFailure` (adds `error`, `errorSerialized()`).
- `createGenericOperation.ts` — `createGenericOperation(operation, data?): OperationPending`.
- `createOperationSuccess.ts` — `createOperationSuccess(pending, message?): OperationSuccess`.
- `createOperationFailure.ts` — `createOperationFailure(pending, error, options?: { label?: string }): OperationFailure`.
- `types.test.ts` / factory tests — outcomes, timing, label application.
- Update `src/index.ts` and `src/model/index.ts` exports.

**Dependencies:**

- Iteration: Scaffold CLI Operations Package.

#### Commits:

| ID                     | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| ---------------------- | --------------------------------- | ------------ | ---- | ---------- |
| `add-operations-model` | Art Lib / `$ART_LIB` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `add-operations-model`

**Message:**

```text
build(operations): Add operation model and factories.
```

### Iteration: Implement Operations Log

**Id:** `implement-operations-log`

**Status:** `PLANNING`

**Purpose:** Add the append-only operations log, created with the logger and forwarding every operation to it.

**Description:** Implement `src/log/` with `OperationsLog { log(op), all(), since(ts), latest(n) }` and `createOperationsLog(logger, options?)`. Every recorded operation is forwarded to `logger.log(...)`; pending operations pass through to the logger but only finished operations are stored. Operations conform to the `Message` interface of `@art-lib/logger` (level derived from the outcome). Export and unit test.

**Changes:**

In `$ART_LIB/libs/operations/src/log/`

- `types.ts` — `OperationsLog` interface.
- `createOperationsLog.ts` — `createOperationsLog(logger, options?): OperationsLog`; forwards every operation to `logger.log`; stores finished ops only; `since`/`latest` query semantics.
- `createOperationsLog.test.ts` — storage filter, queries, forwarding to the logger.
- Update `src/index.ts` and `src/log/index.ts` exports.

**Dependencies:**

- Iteration: Implement Operations Model.
- Plan: Add Logger Package, Iteration: Implement Buffering Logger.

#### Commits:

| ID                   | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| -------------------- | --------------------------------- | ------------ | ---- | ---------- |
| `add-operations-log` | Art Lib / `$ART_LIB` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `add-operations-log`

**Message:**

```text
build(operations): Add operations log module.
```

---

## Coordination

### Not In Scope

- **Adoption refactors in `@art-work/cli` and `@art-md/bin`** are out of scope — each consumer migrates in its own project after this package publishes.
- **`cli-command-runner`, `cli-test-helpers`, `cli-present`** are rejected per the milestone decision; revisit triggers recorded as milestone follow ups.

### Evidence

- `@art-lib/operations` builds, lints, and tests green from `$ART_LIB/libs/operations`; both subpaths resolve via the exports map.

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

- Consumers (`@art-work/cli`, `@art-md/bin`) adopt the package in their own milestones.
- Revisit `cli-command-runner` when a third CLI exists; dedup temp-dir test helpers as a later chore (milestone follow ups).

### Feedback

- None.
