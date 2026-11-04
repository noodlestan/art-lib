# Design: Logger

**Purpose:** The published surface of `@art-lib/logger` — what it exports, the buffering contract it guarantees, and how a consumer calls it.

Install with `npm install @art-lib/logger`.

## Public Surface

`src/index.ts` exports six functions and six types, and nothing else re-exports across the boundaries:

```ts
createLogger(options?: CreateLoggerOptions): LoggerAPI;

createMessage(options: CreateMessageOptions): Message;
createDebugMessage(text: string): Message;
createInfoMessage(text: string): Message;
createWarningMessage(text: string): Message;
createErrorMessage(error: MaybeError, message?: string): Message;

Message { level: MessageLevel; text(): string; ts: number }
MessageLevel = 'debug' | 'info' | 'warning' | 'error'
MaybeError = Error | unknown

LoggerAPI { log(message: Message): void; setOutputMode(mode: OutputMode): void }
OutputMode = 'quiet' | 'normal' | 'verbose'
LogFormatter { format(message: Message): string[] }
LogWriter { write(lines: string[]): void }
CreateLoggerOptions { formatter?: LogFormatter; writer?: LogWriter }
CreateMessageOptions { level: MessageLevel; text?: string; error?: MaybeError }
```

- `createLogger` — the buffering logger: buffer, resolve the mode, then format and write.
- `createMessage` — the generic creator; `text` wins over `error`, which falls back to `''`.
- `createDebugMessage` / `createInfoMessage` / `createWarningMessage` — one creator per level.
- `createErrorMessage` — level `error`; accepts any error-shaped value and falls back to `message`.

`CreateLoggerOptions`, `CreateMessageOptions`, and `MaybeError` are parameter types, not exports — consumers pass object literals and any error-shaped value.

## Buffering Contract

| Moment                     | Behaviour                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| Before `setOutputMode`     | `log(message)` buffers; nothing is written.                                                |
| `setOutputMode('normal')`  | flushes the buffer in order, dropping `debug`, then writes `info`, `warning`, `error`.     |
| `setOutputMode('quiet')`   | flushes the buffer in order, writing only `warning` and `error`; drops `info` and `debug`. |
| `setOutputMode('verbose')` | flushes the buffer in order, then writes every message.                                    |
| Mode set again             | the same rule applies to the (now empty) buffer; no re-emission of old messages.           |

**Every mode flushes; none discards.** The buffer exists because the mode is not yet known — once it is, the rule that governs messages logged afterwards governs the buffered ones too, so arrival time never decides survival and only the level does. `quiet` therefore keeps a pre-mode `warning` or `error` and drops `info`/`debug`, exactly as it treats messages logged after the mode was set.

The mode is optional at construction and required before emission, so a CLI can start logging before its environment is fully resolved. `normal` is the default choice for `setOutputMode` — the mode to pick when nothing else decides it.

## Log Line

The default formatter renders one line of four cells joined with `|`:

```
ℹ️  | parse | notes.art | (8ms)
⚠️  |  | cache directory missing |
```

- Cell 1 — level glyph: `⏳` debug, `ℹ️` info, `⚠️` warning, `🔴` error.
- Cell 2 — the `operation` name when the message carries one; empty otherwise.
- Cell 3 — `text()`.
- Cell 4 — the duration as `(8ms)` when the message carries a `timing` function; empty otherwise.

Formatting is delegated to an injected `LogFormatter { format(message): string[] }` — consumers supply project-specific columns without forking the logger.

## LogWriter

Lines are emitted through an injectable `LogWriter { write(lines): void }`. The default writer joins the lines with newlines and writes them with `console.error` (stderr keeps stdout clean for machine-readable output). Tests and future sinks (files, reactive layers) inject their own writer.

## Usage

```ts
import { createInfoMessage, createLogger, createWarningMessage } from '@art-lib/logger';

const logger = createLogger({
  formatter: {
    format: message => [`${message.level.toUpperCase()} ${message.text()}`],
  },
  writer: {
    write: lines => process.stdout.write(`${lines.join('\n')}\n`),
  },
});

logger.log(createInfoMessage('starting up')); // buffered

logger.setOutputMode('normal'); // flushes the buffer (dropping debug), then writes info and above

logger.log(createInfoMessage('config loaded')); // written

logger.setOutputMode('quiet'); // from here on: warnings and errors only

logger.log(createWarningMessage('cache directory missing')); // written
logger.log(createInfoMessage('still working')); // dropped
```

Without options, the default formatter and the `console.error` writer are used. The message model, the buffering rules, and a consumer-ready walkthrough live in the [README](../../README.md).
