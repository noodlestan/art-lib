# Instructions: `implement-buffering-logger`

**Plan:** `add-logger`

**Iteration Id:** `implement-buffering-logger`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

**Prerequisite:** `Iteration: Scaffold Logger Package` must be `DONE` (its files exist in `$PROJECT/libs/logger/`). If not, REPORT A BLOCKER with "logger package not scaffolded yet" and STOP.

## How to Report Back to the Delegator

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `./plan-add-logger/instructions/implement-buffering-logger__report.md`.
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

Implement the message model and the buffering logger of `@art-lib/logger`: `Message` with severity levels and creators, plus `createLogger()` with output modes (`quiet`/`verbose`), an injected formatter, and an injectable writer. The logger knows messages only — never operations. Commit as `build(logger): Add message model and buffering logger.`

## Mandatory Reading

- plan: `$PROJECT/_backlog/3-now/plan-add-logger/plan.md` — this plan; the iteration Changes list the exact files.
- design: `$PROJECT/knowledge/design/logger.md` — Message, output-mode semantics, default log line, writer rules.
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

Do NOT run `npm install` inside `$PROJECT/libs/logger` — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Instructions:** (From `$PROJECT/_guide.md`) — from `$PROJECT/libs/logger/`:

```bash
npm run lint:fix
npm run lint
npm run build
npm run test
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Changes

- Step 1 / 4 — Implement the message model and creators.
- Step 2 / 4 — Implement the buffering logger with formatter and writer.
- Step 3 / 4 — Add unit tests and export from `src/index.ts`.
- Step 4 / 4 — Commit `add-buffering-logger`.

## Steps

### Step `1 / 4` — Implement the message model

**`$PROJECT/libs/logger/src/message/types.ts`**

```ts
export type MessageLevel = 'debug' | 'info' | 'warning' | 'error';

export type MaybeError = Error | unknown;

export interface Message {
  level: MessageLevel;
  text(): string;
  ts: number;
}
```

**`$PROJECT/libs/logger/src/message/createMessage.ts`**

```ts
export function createMessage(options: {
  level: MessageLevel;
  text?: string;
  error?: MaybeError;
}): Message;
export function createDebugMessage(text: string): Message;
export function createInfoMessage(text: string): Message;
export function createWarningMessage(text: string): Message;
export function createErrorMessage(error: MaybeError, message?: string): Message;
```

- `createMessage({ level, ... })` is the generic creator; `text` supplies the text.
- `createErrorMessage` sets level `error`; it accepts any error-shaped value: when the value has a `.message`, use it, otherwise fall back to the `message` argument (or `''`). Never throw while creating an error message.
- Every message carries `ts` = `Date.now()` at creation.

### Step `2 / 4` — Implement the buffering logger

**`$PROJECT/libs/logger/src/types.ts`**

```ts
export type OutputMode = 'quiet' | 'verbose';

export interface LogFormatter {
  format(message: Message): string[];
}

export interface LogWriter {
  write(lines: string[]): void;
}

export interface LoggerAPI {
  log(message: Message): void;
  setOutputMode(mode: OutputMode): void;
}
```

**`$PROJECT/libs/logger/src/createLogger.ts`**

```ts
export function createLogger(options?: { formatter?: LogFormatter; writer?: LogWriter }): LoggerAPI;
```

- Start with the output mode **unset** and an empty buffer: `log()` before the mode is set appends to the buffer — nothing is emitted yet.
- `setOutputMode('quiet')` — discard the buffer, then emit only messages with level `warning`/`error`.
- `setOutputMode('verbose')` — flush the buffer in order (emitting every buffered message), then emit every subsequent message.
- Setting the mode twice follows the same rule against the already-set mode; messages logged between modes pass through the same buffer discipline (keep it simple: buffer only exists before the first `setOutputMode`).
- Default writer: wraps `console.error` (stderr keeps stdout clean).
- Default formatter: four cells joined with `|` — level glyph (`debug` → `⏳`, `info` → `ℹ️`, `warning` → `⚠️`, `error` → `🔴`), message name when the message carries one (an optional `operation` property — operations will conform structurally later — otherwise an empty cell), `text()`, and timing (`timing()` in `(8ms)` form when the message exposes a finite one, otherwise empty).
- Formatting delegates to the injected formatter; writing delegates to the injected writer. The logger never imports operations.

### Step `3 / 4` — Add unit tests and exports

**`$PROJECT/libs/logger/src/message/createMessage.test.ts`** — creators per level; `createErrorMessage` with a real `Error`, with a string, and with a fallback `message`; `ts` populated.

**`$PROJECT/libs/logger/src/createLogger.test.ts`** — messages buffered before the mode is set; `quiet` discards the buffer and then emits only `warning`/`error`; `verbose` flushes then emits everything; writer receives the formatter's lines (inject both and assert delegation); default formatter produces the four cells; custom formatter is used verbatim.

Update `$PROJECT/libs/logger/src/index.ts` to export `createLogger`, the message creators, `Message`, `MessageLevel`, `LoggerAPI`, `LogFormatter`, `LogWriter`, `OutputMode`.

Verify from `$PROJECT/libs/logger/`: `npm run lint`, `npm run build`, `npm run test`.

### Step `4 / 4` — Commit `add-buffering-logger`

#### Commit: `add-buffering-logger`

**Policy:** AUTONOMOUS — Agent should commit autonomously, push, and proceed to the next step.

**Message:**

```text
build(logger): Add message model and buffering logger.

- Add `Message` creators, `LoggerAPI`, injected formatter, and injectable writer.
- Buffer messages until the output mode is set; cover `quiet`/`verbose` with tests.
```

---

## Final Verification

- Verify that the commit has been executed according to the commit's policy.
- Verify `src/index.ts` exports the message model, the creators, and `createLogger`.
- Verify the logger imports nothing from `@art-lib/operations` — messages only.
- Verify buffer semantics: nothing emitted before `setOutputMode`; `quiet` discards; `verbose` flushes.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
