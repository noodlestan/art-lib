# Plan: Add Logger Package

**ID:** `add-logger`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Provide a normalized way to log messages — operations conform to the message interface — with buffering, wrapping the actual log writer.

**Description:** Create the `@art-lib/logger` package: a `Message` interface with severity levels and message creators (`createMessage`, `createInfoMessage`, `createWarningMessage`, `createErrorMessage`, `createDebugMessage`), and a buffering logger with output modes that formats messages through an injected formatter and writes through an injectable log writer. The logger knows only messages — never operations. Split out of the operations package per the milestone decision.

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

::READ `$PROJECT/knowledge/design/logger.md` (Design) — Consumer requirements from Art Works and Art MD CLIs. Relevant for Planning Work Item.

::READ `$PROJECT/knowledge/index.md` (Model) — Package layout and publishing conventions. Relevant for Planning Work Item.

## Scope

Create `$PROJECT/libs/logger` exposing the message model (`Message`, creators) and the buffering logger — `LoggerAPI`, `LogFormatter`, injectable writer, `quiet`/`verbose` modes — with tests, package records, and docs mirroring `libs/fs-records` conventions. Operation model and log stay in `@art-lib/operations`; adoption refactors in consumers are out of scope.

## Work

### Next

- Planning complete: all five iterations are `READY` with instructions. Delegate Iteration: Scaffold Logger Package, Iteration: Implement Buffering Logger, Iteration: Apply Noodlestan Conventions (`MANUAL` commit), Iteration: Update Knowledge, then Iteration: Integrate in Consumer. No dependencies on other plans; land the `Message` interface before Plan: Add Operations Package implements its Operations Log.

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
| Iteration: Scaffold Logger Package      | `READY` |
| Iteration: Implement Buffering Logger   | `READY` |
| Iteration: Apply Noodlestan Conventions | `READY` |
| Iteration: Update Knowledge             | `READY` |
| Iteration: Integrate in Consumer        | `READY` |

### Iteration: Scaffold Logger Package

**Id:** `scaffold-logger-package`

**Status:** `READY`

**Purpose:** Create the `logger` package skeleton before adding the module.

**Description:** Scaffold `$PROJECT/libs/logger` mirroring `libs/fs-records` conventions: `package.json` (root export; no internal dependencies — the logger knows only messages), tsconfig, vitest config, npm scripts, `_guide.md`, `_records/package.art`, `src/index.ts` placeholder.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$PROJECT/libs/logger`

- Create `package.json` — name `@art-lib/logger`, root export, no internal dependencies, scripts mirroring `libs/fs-records`.
- Create `tsconfig.json` and vitest config extending the monorepo configs.
- Create `src/index.ts` as placeholder entry point.
- Create `_guide.md` describing the package and operating instructions.
- Create `_records/package.art` mirroring `libs/fs-records/_records`.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above, mirroring `libs/fs-records` conventions.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.

Validate that:

- `package.json` carries the name `@art-lib/logger`, the root export `./src/index.ts`, and the standard scripts.
- No `node_modules` directory is created inside `$PROJECT/libs/logger`.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/logger/`.
- Commit `scaffold-logger` with the blueprint message below.

**Dependencies:**

- None.

#### Commits:

| ID                | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| ----------------- | ------------------------------ | ------------ | ------- | ---------- |
| `scaffold-logger` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `scaffold-logger`

**Message:**

```text
scaffold(logger): Scaffold package skeleton.

- Create manifest, tsconfig, vitest config, and scripts mirroring `libs/fs-records`.
- Add `_guide.md` and `_records/package.art`.
```

### Iteration: Implement Buffering Logger

**Id:** `implement-buffering-logger`

**Status:** `READY`

**Purpose:** Implement the message model and the buffering logger with output modes, injected formatter, and injectable writer.

**Description:** Implement `src/` with the message model — `Message { level, text(), ts }`, `createMessage(options)`, `createDebugMessage`, `createInfoMessage`, `createWarningMessage`, `createErrorMessage(error: MaybeError, message?)` — and the logger — `LoggerAPI { log(message), setOutputMode(mode) }`, `LogFormatter { format(message): string[] }`, `LogWriter { write(lines): void }`, `createLogger(options?: { formatter?, writer? })`. Buffer messages until the mode is set: `quiet` discards the buffer and then logs only `warning`/`error`; `verbose` flushes and logs everything. Default writer wraps `console.error`; formatting delegates to the injected formatter. The logger never imports operations — they conform to `Message` structurally. Unit tests.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./plan-add-logger/instructions/implement-buffering-logger.md`

**Changes:**

In `$PROJECT/libs/logger/src/`

- `message/types.ts` — `Message`, `MessageLevel`, `MaybeError`.
- `message/createMessage.ts` — `createMessage`, `createDebugMessage`, `createInfoMessage`, `createWarningMessage`, `createErrorMessage`.
- `types.ts` — `LoggerAPI`, `LogFormatter`, `LogWriter`.
- `createLogger.ts` — `createLogger(options?)`; buffer semantics for `quiet`/`verbose`; default writer via `console.error`; default formatter producing the glyph | name | text | timing cells.
- `message/createMessage.test.ts` and `createLogger.test.ts` — creators per level, buffering, mode transitions, writer delegation, formatter injection.
- Update `src/index.ts` exports.

**Dependencies:**

- Iteration: Scaffold Logger Package.

#### Commits:

| ID                     | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| ---------------------- | ------------------------------ | ------------ | ------- | ---------- |
| `add-buffering-logger` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `add-buffering-logger`

**Message:**

```text
build(logger): Add message model and buffering logger.

- Add `Message` creators, `LoggerAPI`, injected formatter, and injectable writer.
- Buffer messages until the output mode is set; cover `quiet`/`verbose` with tests.
```

### Iteration: Apply Noodlestan Conventions

**Id:** `apply-noodlestan-conventions`

**Status:** `READY`

**Purpose:** Align `libs/logger` with the Noodlestan conventions adopted in this workspace.

**Description:** Audit the package against the conventions declared in `$PROJECT/_guide.md` (TypeScript, unit tests) using the `manage-conventions` skill, install what is missing, and resolve the findings — without changing the package behaviour. Commit as `style(logger): Apply Noodlestan conventions.`

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$PROJECT/libs/logger`

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

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/logger/`.
- The commit `apply-conventions-logger` has policy `MANUAL` — stage the changes, report back with the proposed commit message; do not commit.

**Dependencies:**

- Iteration: Implement Buffering Logger.

#### Commits:

| ID                         | Repository / Checkout / Branch | Policy   | Hash    | Status     |
| -------------------------- | ------------------------------ | -------- | ------- | ---------- |
| `apply-conventions-logger` | Art Lib / `$PROJECT` / `main`  | `MANUAL` | `(TBD)` | `AUTHORED` |

##### Commit: `apply-conventions-logger`

**Message:**

```text
style(logger): Apply Noodlestan conventions.

- Adopt the conventions that apply to the package and resolve audit findings.
```

### Iteration: Update Knowledge

**Id:** `update-knowledge`

**Status:** `READY`

**Purpose:** Publish the package knowledge base and wire `@art-lib/logger` into the repository artefacts.

**Description:** Add a consumer-facing README and a package knowledge base, then update the repository knowledge, project record, and guide to list the package and link its knowledge. Commit as `docs(logger): Add package knowledge base and README usage.`

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

- `$PROJECT/libs/logger/README.md` — consumer-facing `## Usage` following the pattern of `$WORKSPACE/checkouts/workspace-tooling/cli/esbuild-cli/README.md`: what it is, install, configure, example, options.
- `$PROJECT/libs/logger/knowledge/` — package knowledge base following `$WORKSPACE/checkouts/art-md/cli/bin/knowledge`: at least `index.md`, `overview.md`, and `design/logger.md`; add `adr/` records where decisions exist.
- `$PROJECT/libs/logger/_guide.md` — reference the local knowledge base (`knowledge/index.md`).
- `$PROJECT/knowledge/components.md` — move the Logger entry to `IMPLEMENTED` and link its package knowledge.
- `$PROJECT/knowledge/index.md` — add a Package Knowledge References row linking `libs/logger/knowledge/index.md` (see `$WORKSPACE/checkouts/art-md/knowledge/index.md`).
- `$PROJECT/_records/project.art` — add `- Package: Art Lib Logger` to Resources.
- `$PROJECT/_guide.md` — list the package under the repository layout and its knowledge base under Knowledge References.
- Keep `$PROJECT/knowledge/design/logger.md` as the repository-level design record.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.

Validate that:

- The package knowledge links resolve and the README `## Usage` is self-sufficient for a new consumer.
- Every repository reference lists the package: `knowledge/index.md`, `knowledge/components.md`, `_records/project.art`, `_guide.md`.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/logger/`.
- Commit `update-knowledge-logger` with the blueprint message below.

**Dependencies:**

- Iteration: Apply Noodlestan Conventions.

#### Commits:

| ID                        | Repository / Checkout / Branch | Policy       | Hash    | Status     |
| ------------------------- | ------------------------------ | ------------ | ------- | ---------- |
| `update-knowledge-logger` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `update-knowledge-logger`

**Message:**

```text
docs(logger): Add package knowledge base and README usage.

- Add the package knowledge base, a consumer-facing README, and repository references.
- Link the package knowledge from the repository knowledge index.
```

### Iteration: Integrate in Consumer

**Id:** `integrate-in-consumer`

**Status:** `READY`

**Purpose:** Adopt `@art-lib/logger` in the Art Workspace Cli and retire its duplicated implementation.

**Description:** Refactor `$WORKSPACE/checkouts/art-works/cli/workspace` to consume `@art-lib/logger`, keeping CLI-specific conventions on the CLI side. Commit in the Art Works repository as `refactor(workspace-cli): Adopt @art-lib/logger in the Workspace Cli.`

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$WORKSPACE/checkouts/art-works` (Art Works repository)

- `cli/workspace/package.json` — declare `@art-lib/logger` the way `@art-lib/fs-records` is declared.
- `cli/workspace/src/private/logger/createLogger.ts` — replace with `createLogger` from `@art-lib/logger`; inject the CLI's log-line formatter where it differs from the package default.
- `cli/workspace/src/private/present/makeOperationLogLine.ts` — keep as the formatter passed to `createLogger`, or retire it when the package default covers the CLI's log line.
- Update callers and test helpers; keep the logged output identical.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

**GATE — do not start if the gate has not lifted:** this iteration requires the whole `@art-lib/logger` plan to be `DONE`, including the `MANUAL` conventions commit. If `$PROJECT/libs/logger` does not expose the landed API, REPORT A BLOCKER with "logger package not landed yet" and STOP.

Execute the Changes listed above, keeping the CLI behaviour identical.

Before starting:

- Run `npm ci` from `$WORKSPACE/checkouts/art-works`.

Validate that:

- `npm run ci` passes from `$WORKSPACE/checkouts/art-works/cli/workspace`.
- The CLI behaviour is unchanged: the same inputs produce the same outputs.

After executing:

- Commit `integrate-logger-in-consumer` in the Art Works repository with the blueprint message below.

**Dependencies:**

- Iteration: Update Knowledge.

#### Commits:

| ID                             | Repository / Checkout / Branch                        | Policy       | Hash    | Status     |
| ------------------------------ | ----------------------------------------------------- | ------------ | ------- | ---------- |
| `integrate-logger-in-consumer` | Art Works / `$WORKSPACE/checkouts/art-works` / `main` | `AUTONOMOUS` | `(TBD)` | `AUTHORED` |

##### Commit: `integrate-logger-in-consumer`

**Message:**

```text
refactor(workspace-cli): Adopt @art-lib/logger in the Workspace Cli.

- Replace the local local buffering logger with @art-lib/logger.
- Keep CLI behaviour and its test suite green.
```

---

## Coordination

### Not In Scope

- **Operation model and operations log** — stay in `@art-lib/operations` (`/model`, `/log`).
- **Consumer adoption beyond Art Works** — `@art-works/workspace-cli` is the first consumer (Iteration: Integrate in Consumer); other CLIs migrate in their own projects.

### Evidence

- `@art-lib/logger` builds, lints, and tests green from `$PROJECT/libs/logger`; buffering, modes, formatter, and writer covered by passing unit tests.

### Findings

- Art Works and Art MD both implement the same buffering logger (quiet/verbose, buffer until mode set); the only variation is the log-line formatter and the writer target.

### Decisions

- Split from `@art-lib/operations` per the milestone decision — logger is effectful (wraps the log writer); operations stay in `@art-lib/operations`.
- **The logger knows only messages** — one `Message` interface with severity levels; operations conform to it structurally, so the logger has no dependency on `@art-lib/operations` (and no cycle is possible).
- The log writer is injectable (`LogWriter`) so tests and future sinks (file, reactive layer) do not touch `console.error` directly.

### Knowledge to Update

- Keep the `logger` package entry in `knowledge/components.md` in sync after scaffolding.

### Follow Ups

- `@art-works/workspace-cli` adoption is planned here (Iteration: Integrate in Consumer); `@art-md/bin` migrates in its own project.

### Feedback

- None.
