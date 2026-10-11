# Plan: Add Logger Package

**ID:** `add-logger`

**Status:** `PLANNING`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Provide a normalized way to log operations and messages with buffering, wrapping the actual log writer.

**Description:** Create the `@art-lib/logger` package: a buffering logger with output modes that logs operations consistently before and after the environment is fully resolved, formats log lines through an injected formatter, and wraps an injectable log writer. Split out of the operations package per the milestone decision.

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

Create `@art-lib/logger` with a buffering `createLogger()` — `quiet`/`verbose` output modes, injected `LogFormatter`, injectable log writer — consuming operation values from `@art-lib/operations` `/model`.

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

Create `$ART_LIB/libs/logger` exposing the buffering logger — `LoggerAPI`, `LogFormatter`, injectable writer, `quiet`/`verbose` modes — with tests, package records, and docs mirroring `libs/fs-records` conventions. Operation model and log stay in `@art-lib/operations`; adoption refactors in consumers are out of scope.

## Work

### Next

- Write instructions for the two `PLANNING` iterations, then delegate Iteration: Scaffold Logger Package. Sequence after Plan: Add Operations Package, Iteration: Implement Operations Model.

### Blockers

- None. Sequencing note: `implement-logger` imports the `Operation` type from `@art-lib/operations` `/model` — execute after that iteration lands.

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

**Description:** Scaffold `$ART_LIB/libs/logger` mirroring `libs/fs-records` conventions: `package.json` (root export only; dependency on `@art-lib/operations` for the `Operation` type), tsconfig, vitest config, npm scripts, `_guide.md`, `_records/package.art`, `src/index.ts` placeholder.

**Changes:**

In `$ART_LIB/libs/logger`

- Create `package.json` — name `@art-lib/logger`, root export, dependency `@art-lib/operations`, scripts mirroring `libs/fs-records`.
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

**Purpose:** Implement the buffering logger with output modes, injected formatter, and injectable writer.

**Description:** Implement `src/` with `LoggerAPI { log(op), setOutputMode(mode) }`, `LogFormatter { format(op): string[] }`, `LogWriter { write(lines: string[]): void }`, and `createLogger(options?: { formatter?, writer? })`. Buffer operations until the mode is set: `quiet` discards the buffer and drops future pending ops; `verbose` flushes and logs every operation. Default writer wraps `console.error`; formatting delegates to the injected formatter. Unit tests.

**Changes:**

In `$ART_LIB/libs/logger/src/`

- `types.ts` — `LoggerAPI`, `LogFormatter`, `LogWriter`.
- `createLogger.ts` — `createLogger(options?)`; buffer semantics for `quiet`/`verbose`; default writer via `console.error`; default formatter producing the glyph | operation | message | timing cells.
- `createLogger.test.ts` — buffering, mode transitions, writer delegation, formatter injection.
- Update `src/index.ts` exports.

**Dependencies:**

- Iteration: Scaffold Logger Package.
- Plan: Add Operations Package, Iteration: Implement Operations Model.

#### Commits:

| ID                     | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| ---------------------- | --------------------------------- | ------------ | ---- | ---------- |
| `add-buffering-logger` | Art Lib / `$ART_LIB` / `building` | `AUTONOMOUS` |      | `PLANNING` |

##### Commit: `add-buffering-logger`

**Message:**

```text
build(logger): Add buffering operations logger.
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

- Split from `@art-lib/operations` per the milestone decision — logger is effectful (wraps the log writer); `/model` and `/log` stay pure.
- The log writer is injectable (`LogWriter`) so tests and future sinks (file, reactive layer) do not touch `console.error` directly.

### Knowledge to Update

- Keep the `logger` package entry in `architecture/components.md` in sync after scaffolding.

### Follow Ups

- Consumers (`@art-work/cli`, `@art-md/bin`) adopt the package in their own milestones.

### Feedback

- None.
