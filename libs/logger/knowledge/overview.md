# Overview: Art Lib Logger

**Purpose:** Introduce the logger package: what it is, its definitions, its principles, its use cases, and how a log works.

## What

`@art-lib/logger` exposes the message model — `Message` with severity levels `debug`, `info`, `warning`, and `error`, plus `createMessage`, `createDebugMessage`, `createInfoMessage`, `createWarningMessage`, and `createErrorMessage` — and `createLogger()`, a buffering logger with `quiet`/`normal`/`verbose` output modes, an injected `LogFormatter`, and an injectable `LogWriter`.

## Why

CLIs log while their environment is still resolving: argument parsing, config loading, and command execution all produce messages at different stages. One writer with one line format keeps that output consistent, but a writer that is not ready yet would drop or interleave the early messages. The logger buffers until the output mode is set, then applies the mode — so messages are logged consistently **before and after** the environment is fully resolved.

## Definitions

- **Message** — `{ level, text(), ts }`: severity (`debug` | `info` | `warning` | `error`), the message text (or error reason), and the creation timestamp.
- **Output mode** — `quiet`, `normal`, or `verbose`; resolved through `setOutputMode`, and required before anything is written. `normal` is the default.
- **Buffer** — messages logged before the mode is set; flushed against the mode's own rule once it is set (`quiet` writes `warning`/`error`, `normal` writes `info` and above, `verbose` writes everything) and the remainder are dropped.
- **LogFormatter** — `{ format(message): string[] }`; turns a message into the lines to write.
- **LogWriter** — `{ write(lines): void }`; receives the formatter's lines. The default wraps `console.error`.

## Principles

- **Messages only.** The logger knows messages and nothing else. Anything that conforms to `Message` can be logged; the logger holds no concept of the producer's domain, so no producer ever becomes a dependency of this package.
- **Modes filter; they never derive.** A mode decides which levels pass — `verbose` all, `normal` `info` and above, `quiet` `warning`/`error` — and never how a level is derived. Deriving a level belongs to the producer.
- **Every mode flushes; none discards.** The buffer exists only because the mode is not yet known. Once it is set, that mode's rule governs what was buffered exactly as it governs what follows, so a message survives by its level alone — arrival time never decides survival.

## Use Cases

| #   | Use case        | Behaviour                                                                                                     |
| --- | --------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | **Log early**   | `log()` before `setOutputMode` buffers the message; nothing is written.                                       |
| 2   | **Normal**      | `setOutputMode('normal')` — the default — flushes the buffer, dropping `debug`, then writes `info` and above. |
| 3   | **Quiet**       | `setOutputMode('quiet')` flushes the buffer, writing only `warning` and `error` and dropping `info`/`debug`.  |
| 4   | **Verbose**     | `setOutputMode('verbose')` flushes the buffer in order, then writes every message.                            |
| 5   | **Custom line** | Inject a `formatter` so the consumer owns the line format without forking the logger.                         |
| 6   | **Custom sink** | Inject a `writer` — tests, files, reactive layers — without touching `console.error`.                         |

## How It Works

`createLogger(options?)` orchestrates four steps:

1. **Create** — resolve `formatter` and `writer` (package defaults when omitted), and start with an empty buffer and no output mode.
2. **Buffer** — `log(message)` while the mode is undefined pushes the message onto the buffer and returns.
3. **Resolve** — `setOutputMode(mode)` applies the mode's rule to the buffer in order — `quiet` writing only `warning`/`error`, `normal` dropping `debug`, `verbose` writing everything — then clears it.
4. **Emit** — once the mode is set, `log(message)` formats through the formatter and writes through the writer when the mode allows it: `quiet` lets `warning` and `error` through, `normal` lets `info` and above through, `verbose` lets everything through.

The public surface behind these cases is documented in [`design/logger.md`](design/logger.md).
