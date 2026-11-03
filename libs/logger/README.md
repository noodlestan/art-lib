# @art-lib/logger

> Create and log messages with a buffering logger: quiet, normal, and verbose output modes, an injected formatter, and an injectable log writer.

This package is part of the [Art Lib toolkit](../../README.md).

## Design

The package publishes a **message model** and a **buffering logger**. A `Message` carries a severity level (`debug`, `info`, `warning`, `error`), a `text()` accessor, and a creation timestamp, and the creators build one per level. The logger knows only messages: anything that structurally conforms to `Message` can be logged, so producers never become a dependency of this package.

Messages logged before the output mode is set are buffered, and the mode then decides their fate — so a CLI logs consistently **before and after** its environment is fully resolved. Formatting is delegated to an injected `LogFormatter`; writing goes through an injectable `LogWriter`. Consumers bring their own columns and sinks without forking the logger.

## Usage

### Install

```bash
npm install @art-lib/logger
```

### Configure

Create a logger and resolve the output mode as soon as it is known:

```ts
import { createLogger } from '@art-lib/logger';

const logger = createLogger();

// Nothing is written before this line.
logger.setOutputMode(process.env.VERBOSE ? 'verbose' : 'normal');
```

### Example

```ts
import {
  createErrorMessage,
  createInfoMessage,
  createLogger,
  createWarningMessage,
} from '@art-lib/logger';

const logger = createLogger();

// Buffered until the output mode is set.
logger.log(createInfoMessage('discovering record files'));

logger.setOutputMode(process.argv.includes('--verbose') ? 'verbose' : 'normal');

// `normal` (the default) flushes the buffered message above, dropping `debug`.
// `quiet` keeps only warnings and errors from that buffer — and from here on.
logger.log(createWarningMessage('cache directory missing'));

try {
  const files = await discoverRecordFiles();

  logger.log(createInfoMessage(`discovered ${files.length} files`));
} catch (error) {
  logger.log(createErrorMessage(error, 'discovery failed'));
}
```

### Options

`createLogger(options?)` accepts:

| Option      | Type           | Default                                   | Notes                                         |
| ----------- | -------------- | ----------------------------------------- | --------------------------------------------- |
| `formatter` | `LogFormatter` | four cells: glyph, name, text, and timing | `format(message)` returns the lines to write  |
| `writer`    | `LogWriter`    | writes to `console.error` (stderr)        | `write(lines)` receives the formatter's lines |

The default formatter renders one line of four cells joined with `|` — level glyph, name, `text()`, and timing:

```text
ℹ️  | parse | notes.art | (8ms)
⚠️  |  | cache directory missing |
```

A message that carries an `operation` name or a `timing` function fills those cells; plain messages leave them empty. stderr keeps stdout clean for machine-readable output.

### Output Modes

| Mode      | Buffer and messages afterwards                             |
| --------- | ---------------------------------------------------------- |
| `normal`  | flushes the buffer, then writes `info`, `warning`, `error` |
| `quiet`   | flushes the buffer, then writes `warning` and `error`      |
| `verbose` | flushes the buffer, then writes every message              |

### Message Creators

| Creator                                   | Level     | Notes                                                       |
| ----------------------------------------- | --------- | ----------------------------------------------------------- |
| `createMessage({ level, text?, error? })` | `level`   | `text` wins; otherwise the error's message; otherwise empty |
| `createDebugMessage(text)`                | `debug`   |                                                             |
| `createInfoMessage(text)`                 | `info`    |                                                             |
| `createWarningMessage(text)`              | `warning` |                                                             |
| `createErrorMessage(error, message?)`     | `error`   | the error's message, falling back to `message`              |

Every creator returns a `Message` — `{ level, text(), ts }` — the one shape `log()` accepts.

## Development

Make sure you read the [Art Lib README](../../README.md) first.

### Build Targets

This package is meant for use in Node.js environments. The entry point is built using `esbuild` pre-configured by [Workspace Tooling](https://github.com/noodlestan/workspace-tooling).

### Scripts

- **$** `npm run dev` — Watch mode for development
- **$** `npm run lint` — Check formatting, lint, and type check
- **$** `npm run lint:fix` — Fix formatting and lint issues
- **$** `npm run build` — Build the package
- **$** `npm run build:clean` — Remove build artifacts
- **$** `npm run test` — Run tests
- **$** `npm run ci` — Run CI pipeline

## Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
