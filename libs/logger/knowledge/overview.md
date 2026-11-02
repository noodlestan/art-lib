# Overview: Art Lib Logger

**Purpose:** Introduce the logger package: what it is, its definitions, its use cases, and how a log works.

## What

`@art-lib/logger` exposes the message model — `Message` with severity levels `debug`, `info`, `warning`, and `error`, plus `createMessage`, `createDebugMessage`, `createInfoMessage`, `createWarningMessage`, and `createErrorMessage` — and `createLogger()`, a buffering logger with `quiet`/`verbose` output modes, an injected `LogFormatter`, and an injectable `LogWriter`.

## Why

CLIs log while their environment is still resolving: argument parsing, config loading, and command execution all produce messages at different stages. One writer with one line format keeps that output consistent, but a writer that is not ready yet would drop or interleave the early messages. The logger buffers until the output mode is set, then applies the mode — so messages are logged consistently **before and after** the environment is fully resolved.

The logger also stays out of the operation business: it knows only messages, so producers conform to `Message` structurally instead of the logger importing them.

## Definitions

- **Message** — `{ level, text(), ts }`: severity (`debug` | `info` | `warning` | `error`), the message text (or error reason), and the creation timestamp.
- **Output mode** — `quiet` or `verbose`; resolved through `setOutputMode`, and required before anything is written.
- **Buffer** — messages logged before the mode is set; discarded by `quiet`, flushed in order by `verbose`.
- **LogFormatter** — `{ format(message): string[] }`; turns a message into the lines to write.
- **LogWriter** — `{ write(lines): void }`; receives the formatter's lines. The default wraps `console.error`.

## Use Cases

| #   | Use case        | Behaviour                                                                             |
| --- | --------------- | ------------------------------------------------------------------------------------- |
| 1   | **Log early**   | `log()` before `setOutputMode` buffers the message; nothing is written.               |
| 2   | **Quiet**       | `setOutputMode('quiet')` discards the buffer, then writes only `warning` and `error`. |
| 3   | **Verbose**     | `setOutputMode('verbose')` flushes the buffer in order, then writes every message.    |
| 4   | **Custom line** | Inject a `formatter` so the consumer owns the line format without forking the logger. |
| 5   | **Custom sink** | Inject a `writer` — tests, files, reactive layers — without touching `console.error`. |

## How It Works

`createLogger(options?)` orchestrates four steps:

1. **Create** — resolve `formatter` and `writer` (package defaults when omitted), and start with an empty buffer and no output mode.
2. **Buffer** — `log(message)` while the mode is undefined pushes the message onto the buffer and returns.
3. **Resolve** — `setOutputMode('quiet')` clears the buffer; `setOutputMode('verbose')` emits each buffered message in order, then clears it.
4. **Emit** — once the mode is set, `log(message)` formats through the formatter and writes through the writer when the mode allows it: `quiet` lets `warning` and `error` through, `verbose` lets everything through.

The public surface behind these cases is documented in [`design/logger.md`](design/logger.md).
