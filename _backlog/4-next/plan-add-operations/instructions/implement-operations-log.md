# Instructions: `implement-operations-log`

**Plan:** `add-operations`

**Iteration Id:** `implement-operations-log`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

**GATE — do not start if the gate has not lifted:** this iteration requires the buffering logger to exist. Plan: Add Logger Package, Iteration: Implement Buffering Logger must be `DONE` — `$PROJECT/libs/logger` exports `createLogger` and `Message`. If `libs/logger` is missing or does not export `createLogger`, REPORT A BLOCKER with "buffering logger not implemented yet" and STOP.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/implement-operations-log__report.md`.
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

Implement the `OperationsLog`: forward every operation to a `LoggerAPI` as a message, store finished operations in memory, and expose the query API (`all()`, `since(ts)`, `latest(n)`). Commit as `build(operations): Add operations log store and queries.`

## Mandatory Reading

- plan: `$PROJECT/_backlog/4-next/plan-add-operations/plan.md` — this plan; the iteration Changes list the exact files.
- design: `$PROJECT/knowledge/design/operations.md` — log contract: forward on `log`, append only when finished, query semantics.
- design: `$PROJECT/knowledge/design/logger.md` — the `LoggerAPI` consumed and the `Message` conformance relied on.
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

Do NOT run `npm install` inside `$PROJECT/libs/operations` — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Instructions:** (From `$PROJECT/_guide.md`) — from `$PROJECT/libs/operations/`:

```bash
npm run lint:fix
npm run lint
npm run build
npm run test
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Changes

- Step 1 / 3 — Implement `OperationsLog` types and `createOperationsLog`.
- Step 2 / 3 — Add unit tests and exports.
- Step 3 / 3 — Commit `add-operations-log`.

## Steps

### Step `1 / 3` — Implement the log

**`$PROJECT/libs/operations/src/log/types.ts`**

```ts
import type { LoggerAPI } from '@art-lib/logger';
import type { OperationSuccess, OperationFailure } from '../model/types.js';

export type AnyFinishedOperation = OperationSuccess | OperationFailure;

export interface OperationsLog {
  log(operation: OperationSuccess | OperationFailure | { outcome: string }): void;
  all(): AnyFinishedOperation[];
  since(timestamp: number): AnyFinishedOperation[];
  latest(count: number): AnyFinishedOperation[];
}

export type OperationsLogOptions = unknown; // reserved; ignored in this iteration
```

(Use the narrowest workable typing for `log`'s parameter — accepting any operation with an `outcome` keeps it open for pending forwarding; finished-only storage is enforced at runtime.)

**`$PROJECT/libs/operations/src/log/createOperationsLog.ts`**

```ts
export function createOperationsLog(
  logger: LoggerAPI,
  options?: OperationsLogOptions,
): OperationsLog;
```

- `log(op)`: forward `op` to `logger.log(...)` **always** (pending and finished — operations are messages); append to the internal store **only when finished** (`outcome !== 'pending'`).
- `all()`: every finished operation in arrival order (array copy — never leak the internal buffer).
- `since(timestamp)`: finished operations with `ts >= timestamp`.
- `latest(count)`: the last `count` finished operations in arrival order; `count` larger than the store returns everything; `count <= 0` returns `[]`.
- In-memory array store; no persistence, no ordering beyond arrival, no reactive streaming (reserved for a future iteration).

### Step `2 / 3` — Add unit tests and exports

**`$PROJECT/libs/operations/src/log/createOperationsLog.test.ts`** (using a spy `LoggerAPI` and factories from the model iteration):

- forwarding: `logger.log` receives pending AND finished operations;
- storage filter: a pending operation is never returned by `all()`/`since()`/`latest()`;
- `all()` returns a copy in arrival order (mutating the returned array does not affect the store);
- `since(ts)` filters by `ts >= timestamp`;
- `latest(n)` returns the last n in order; `n` > store size returns all; `n <= 0` returns `[]`.

Update `$PROJECT/libs/operations/src/index.ts` to re-export from `./log/index.js`, and `$PROJECT/libs/operations/src/log/index.ts` to export `createOperationsLog` and the types.

Verify from `$PROJECT/libs/operations/`: `npm run lint`, `npm run build`, `npm run test`.

### Step `3 / 3` — Commit `add-operations-log`

#### Commit: `add-operations-log`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```text
build(operations): Add operations log store and queries.

- Forward every operation to the logger; store finished ones in memory.
- Expose all/since/latest queries over the finished-operation store.
```

---

## Final Verification

- Verify that the commit has been executed according to the commit's policy.
- Verify pending operations are forwarded to the logger but never stored.
- Verify `all()` returns a copy — the internal store is not exposed.
- Verify `since`/`latest` semantics against the test expectations above.
- Verify no reactive streaming or persistence exists (reserved for future iterations).
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
