# Design: Logger

**Purpose:** Describe what a CLI needs from `@art-lib/logger` — one logging interface for messages, buffering, output modes, log lines, and the writer — as evidenced by the Art Work CLI and Art MD bin consumers.

**Planned package:** `@art-lib/logger` — `_backlog/6-plan/plan-add-logger/plan.md`

## Principle: Messages Only

The logger knows **messages** — nothing else. It has no concept of operations. Anything that conforms to the `Message` interface can be logged; operations (in `@art-lib/operations`) conform to it.

## Message

One interface shared by every loggable thing:

| member   | semantics                                           |
| -------- | --------------------------------------------------- |
| `level`  | severity: `debug` \| `info` \| `warning` \| `error` |
| `text()` | the message text (or error reason)                  |
| `ts`     | creation timestamp                                  |

### Message Creators

- `createMessage({ level, ... })` — generic creator; `options` carries the `level` (severity) and text.
- `createDebugMessage(text)` — level `debug`.
- `createInfoMessage(text)` — level `info`.
- `createWarningMessage(text)` — level `warning`.
- `createErrorMessage(error: MaybeError, message?)` — level `error`; accepts any error-shaped value, falls back to `message` for the text.

Operations satisfy this interface structurally (see `design/operations.md`), so the logger stays operation-agnostic.

## LoggerAPI

| member                | semantics                                            |
| --------------------- | ---------------------------------------------------- |
| `log(message)`        | record a message (buffered until the mode is set)    |
| `setOutputMode(mode)` | resolve the output mode; flush or discard the buffer |

`createLogger()` holds an undefined output mode and a buffer until the mode is set — messages are logged consistently **before and after the environment is fully resolved**.

## Output Modes

- **`quiet`** — discards the buffered messages, then logs only messages at `warning`/`error` (finished work).
- **`verbose`** — flushes the buffer and logs every message, buffered and pending included.

## Log Line

The formatter returns cells joined with `|`; the default formatter renders four cells:

```
🟢 | clone | checkouts/art-work | (8ms)
ℹ️  | command | ["parse",{"file":"notes.art"}] |
```

- Cell 1 — level glyph: `⏳` buffered/pending, `ℹ️` info, `⚠️` warning, `🟢` success, `🔴` error.
- Cell 2 — the message name (operation name when the message is an operation).
- Cell 3 — `text()`.
- Cell 4 — the duration as `(8ms)` when available; empty otherwise.

Formatting is delegated to an injected `LogFormatter { format(message): string[] }` — consumers supply project-specific columns without forking the logger.

## LogWriter

Lines are emitted through an injectable `LogWriter { write(lines): void }`. The default writer wraps `console.error` (stderr keeps stdout clean for machine-readable output). Tests and future sinks (files, reactive layers) inject their own writer.

## Relationship to Operations

The logger does not import operations. `@art-lib/operations` `/log` is created with the logger (`createOperationsLog(logger, options?)`) and forwards every operation to `logger.log(...)` — operations reach the logger as plain conforming messages.

## Sources

- Art Work CLI operations log (logger behaviour): `$ART_WORK/cli/work/architecture/design/operations-log.md`
- Art MD bin operations (logger + log line): `$ART_MD/cli/bin/architecture/design/operations.md`
