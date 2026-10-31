# Instructions: `implement-operations-model`

**Plan:** `add-operations`

**Iteration Id:** `implement-operations-model`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

**Prerequisites:**

- `Iteration: Scaffold Operations Package` must be `DONE` (its files exist in `$PROJECT/libs/operations/`).
- Plan: Add Logger Package must have landed — `Message` is exported from `@art-lib/logger` (the conformance type-test in step 3 imports it). If `$PROJECT/libs/logger` is missing or does not export `Message`, REPORT A BLOCKER with "logger package not landed yet" and STOP.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./instructions/implement-operations-model__report.md`.
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

Implement the pure operations model of `@art-lib/operations`: the immutable operation record types (`OperationOutcome`, `OperationBase`, pending/success/failure shapes) and their factory functions, with the `Message`-conformance members (`level`, `text()`) so operations are loggable. No storage — the Operations Log lands in the next iteration. Commit as `build(operations): Add immutable operations model.`

## Mandatory Reading

- plan: `$PROJECT/_backlog/3-now/plan-add-operations/plan.md` — this plan; the iteration Changes list the exact files.
- design: `$PROJECT/knowledge/design/operations.md` — operation record contract: `message()` semantics (input uri / given message / error reason), `timing()` NaN-while-pending, label-prefixed `errorSerialized()`, and Message conformance (`level` derived from the outcome).
- design: `$PROJECT/knowledge/design/logger.md` — the `Message` interface operations must satisfy structurally.
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

- Step 1 / 4 — Add the operation types with Message-conformance members.
- Step 2 / 4 — Implement the factories.
- Step 3 / 4 — Add unit tests and exports.
- Step 4 / 4 — Commit `add-operations-model`.

## Steps

### Step `1 / 4` — Add the operation types

**`$PROJECT/libs/operations/src/model/types.ts`**

```ts
import type { MessageLevel } from '@art-lib/logger';

export type OperationOutcome = 'pending' | 'success' | 'failure';

export interface OperationBase {
  operation: string;
  ts: number;
  finishedTs?: number;
  outcome: OperationOutcome;
  message(): string; // domain name; what to show
  timing(): number; // ms once finished; NaN while pending
  level: MessageLevel; // derived: pending → debug, success → info, failure → error
  text(): string; // Message conformance; aliases message()
}

export interface OperationPending<D = unknown> extends OperationBase {
  outcome: 'pending';
  data?: D;
}

export interface OperationSuccess<D = unknown> extends OperationBase {
  outcome: 'success';
  data?: D;
  message: string | (() => string);
}

export interface OperationFailure<D = unknown> extends OperationBase {
  outcome: 'failure';
  data?: D;
  error: string; // the raw error message
  errorSerialized(): string; // label-prefixed form
}
```

(Adjust `OperationSuccess.message` to whatever shape keeps `message()` callable and `text()` aliasing it cleanly — prefer keeping `message()` a method everywhere and storing the given success text in a private field.)

- `timing()` returns `finishedTs - ts` when `finishedTs` is set, `NaN` while pending.
- `level` and `text()` are the structural bridge to `@art-lib/logger`'s `Message` (`text(): string` plus `ts: number` plus a level). Do not import `Message` in the model sources — conformance is structural; the type-test in step 3 proves it.

### Step `2 / 4` — Implement the factories

**`$PROJECT/libs/operations/src/model/createOperation.ts`**

```ts
export function createGenericOperation(name: string, data?: unknown): OperationPending;
export function createOperationSuccess(
  pending: OperationPending,
  message?: string,
): OperationSuccess;
export function createOperationFailure(
  pending: OperationPending,
  error: unknown,
  options?: { label?: string },
): OperationFailure;
```

- Pending: `outcome: 'pending'`, `ts: Date.now()`, no `finishedTs`, `message()` returns the input uri when `data` exposes a `uri` property, otherwise `''`.
- Success: `outcome: 'success'`, `finishedTs: Date.now()`, `message()` returns the given message when provided, falling back to the pending's `message()` (the input uri).
- Failure: `outcome: 'failure'`, `finishedTs: Date.now()`, `error` is the raw error message (accept any error-shaped value — a real `Error`, a string, `unknown` — never throw while creating a failure), `errorSerialized()` returns `label ? \`${label}: ${error}\` : error`.
- Every factory copies `operation` and `data` from the pending; records are immutable — no mutating setters; use readonly fields / frozen objects where practical.
- Derived members on every shape: `level` per the mapping in step 1; `text()` returns `message()`; `timing()` per the contract.

### Step `3 / 4` — Add unit tests and exports

**`$PROJECT/libs/operations/src/model/createOperation.test.ts`**

- outcomes: pending → success and pending → failure paths; `finishedTs` set exactly once per terminal transition; `outcome` never reverts.
- `timing()`: finite ms once finished; `NaN` while pending.
- `message()`: pending returns the input uri from `data`; success returns the given message, falling back to the uri; failure returns the error reason.
- `errorSerialized()`: with label → `Label: message`; without label → the raw error message; works with a real `Error`, a string, and an `unknown` value.
- Message conformance type-test: `import type { Message } from '@art-lib/logger';` and assert each factory result assigns to `Message` (e.g. `expectTypeOf<OperationSuccess>().toMatchTypeOf<Message>()` or a plain assignment in a non-executed type assertion).

Update `$PROJECT/libs/operations/src/index.ts` to re-export from `./model/index.js`, and `$PROJECT/libs/operations/src/model/index.ts` to export the types and factories.

Verify from `$PROJECT/libs/operations/`: `npm run lint`, `npm run build`, `npm run test`.

### Step `4 / 4` — Commit `add-operations-model`

#### Commit: `add-operations-model`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```text
build(operations): Add immutable operations model.

- Add operation record types and factories with derived level, text(), and timing().
- Cover outcomes, timing, message semantics, and Message conformance with tests.
```

---

## Final Verification

- Verify that the commit has been executed according to the commit's policy.
- Verify records are immutable — no mutating setters on operation instances.
- Verify `timing()` is `NaN` while pending and finite once finished.
- Verify `level` derives from the outcome (pending → debug, success → info, failure → error) and `text()` aliases `message()`.
- Verify the type-test proves an operation assigns to `Message` of `@art-lib/logger`.
- Verify no storage code exists yet (that is the next iteration).
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
