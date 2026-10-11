# Plan: Add Logger Package

**ID:** `add-logger`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Provide a normalized way to log messages — operations conform to the message interface — with buffering, wrapping the actual log writer.

**Description:** Create the `@art-lib/logger` package: a `Message` interface with severity levels and message creators (`createMessage`, `createInfoMessage`, `createWarningMessage`, `createErrorMessage`, `createDebugMessage`), and a buffering logger with output modes that formats messages through an injected formatter and writes through an injectable log writer. The logger knows only messages — never operations. Split out of the operations package per the milestone decision.

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

Create `@art-lib/logger` with the `Message` interface and message creators, plus a buffering `createLogger()` — `quiet`/`verbose` output modes, injected `LogFormatter`, injectable log writer. The logger has no dependency on `@art-lib/operations`; operations conform to `Message` structurally.

## Context

### Upstream Work

| Kind        | Path                                                         | Role                                                            |
| ----------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| Parking Lot | `$PROJECT/_backlog/_parking-lot.md`                          | Tracks short-term actionables, pending questions, and blockers. |
| Milestone   | `$PROJECT/_roadmap/3-now/milestone-art-lib-one/milestone.md` | Scope and the recorded logger-split decision.                   |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `architecture/design/logger.md` (Design) — Consumer requirements from Art Work and Art MD CLIs. Relevant for Planning Work Item.

::READ `$ART_LIB/architecture/index.md` (Model) — Package layout and publishing conventions. Relevant for Planning Work Item.

## Scope

Create `$ART_LIB/libs/logger` exposing the message model (`Message`, creators) and the buffering logger — `LoggerAPI`, `LogFormatter`, injectable writer, `quiet`/`verbose` modes — with tests, package records, and docs mirroring `libs/fs-records` conventions. Operation model and log stay in `@art-lib/operations`; adoption refactors in consumers are out of scope.

## Work

### Next

- Write instructions for the two `PLANNING` iterations, then delegate Iteration: Scaffold Logger Package. No dependencies on other plans.

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

| Iteration / Instructions              | Status     |
| ------------------------------------- | ---------- |
| Iteration: Scaffold Logger Package    | `PLANNING` |
| Iteration: Implement Buffering Logger | `PLANNING` |

### Iteration: Scaffold Logger Package

**Id:** `scaffold-logger-package`

**Status:** `PLANNING`

**Purpose:** Create the `logger` package skeleton before adding the module.

**Description:** Scaffold `$ART_LIB/libs/logger` mirroring `libs/fs-records` conventions: `package.json` (root export; no internal dependencies — the logger knows only messages), tsconfig, vitest config, npm scripts, `_guide.md`, `_records/package.art`, `src/index.ts` placeholder.

**Changes:**

In `$ART_LIB/libs/logger`

- Create `package.json` — name `@art-lib/logger`, root export, no internal dependencies, scripts mirroring `libs/fs-records`.
- Create `tsconfig.json` and vitest config extending the monorepo configs.
- Create `src/index.ts` as placeholder entry point.
- Create `_guide.md` describing the package and operating instructions.
- Create `_records/package.art` mirroring `libs/fs-records/_records`.

**Dependencies:**

- None.

#### Commits:

| ID                | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| ----------------- | --------------------------------- | ------------ | ---- | ---------- |
| `scaffold-logger` | Art Lib / `$ART_LIB` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `scaffold-logger`

**Message:**

```text
scaffold(logger): Scaffold package skeleton.
```

### Iteration: Implement Buffering Logger

**Id:** `implement-buffering-logger`

**Status:** `PLANNING`

**Purpose:** Implement the message model and the buffering logger with output modes, injected formatter, and injectable writer.

**Description:** Implement `src/` with the message model — `Message { level, text(), ts }`, `createMessage(options)`, `createDebugMessage`, `createInfoMessage`, `createWarningMessage`, `createErrorMessage(error: MaybeError, message?)` — and the logger — `LoggerAPI { log(message), setOutputMode(mode) }`, `LogFormatter { format(message): string[] }`, `LogWriter { write(lines): void }`, `createLogger(options?: { formatter?, writer? })`. Buffer messages until the mode is set: `quiet` discards the buffer and then logs only `warning`/`error`; `verbose` flushes and logs everything. Default writer wraps `console.error`; formatting delegates to the injected formatter. The logger never imports operations — they conform to `Message` structurally. Unit tests.

**Changes:**

In `$ART_LIB/libs/logger/src/`

- `message/types.ts` — `Message`, `MessageLevel`, `MaybeError`.
- `message/createMessage.ts` — `createMessage`, `createDebugMessage`, `createInfoMessage`, `createWarningMessage`, `createErrorMessage`.
- `types.ts` — `LoggerAPI`, `LogFormatter`, `LogWriter`.
- `createLogger.ts` — `createLogger(options?)`; buffer semantics for `quiet`/`verbose`; default writer via `console.error`; default formatter producing the glyph | name | text | timing cells.
- `message/createMessage.test.ts` and `createLogger.test.ts` — creators per level, buffering, mode transitions, writer delegation, formatter injection.
- Update `src/index.ts` exports.

**Dependencies:**

- Iteration: Scaffold Logger Package.

#### Commits:

| ID                     | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| ---------------------- | --------------------------------- | ------------ | ---- | ---------- |
| `add-buffering-logger` | Art Lib / `$ART_LIB` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `add-buffering-logger`

**Message:**

```text
build(logger): Add message model and buffering logger.
```

---

## Coordination

### Not In Scope

- **Operation model and operations log** — stay in `@art-lib/operations` (`/model`, `/log`).
- **Adoption refactors in consumers** — each CLI migrates in its own project after this package publishes.

### Evidence

- `@art-lib/logger` builds, lints, and tests green from `$ART_LIB/logger`; buffering, modes, formatter, and writer covered by passing unit tests.

### Findings

- Art Work and Art MD both implement the same buffering logger (quiet/verbose, buffer until mode set); the only variation is the log-line formatter and the writer target.

### Decisions

- Split from `@art-lib/operations` per the milestone decision — logger is effectful (wraps the log writer); operations stay in `@art-lib/operations`.
- **The logger knows only messages** — one `Message` interface with severity levels; operations conform to it structurally, so the logger has no dependency on `@art-lib/operations` (and no cycle is possible).
- The log writer is injectable (`LogWriter`) so tests and future sinks (file, reactive layer) do not touch `console.error` directly.

### Knowledge to Update

- Keep the `logger` package entry in `architecture/components.md` in sync after scaffolding.

### Follow Ups

- Consumers (`@art-work/cli`, `@art-md/bin`) adopt the package in their own milestones.

### Feedback

- None.
