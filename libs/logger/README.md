# @art-lib/logger

> Buffer and filter log messages, then write them to the console or a consumer-provided destination.

This package is part of the [Art Lib toolkit](../../README.md).

## Install

```bash
npm install @art-lib/logger
```

## Usage

```ts
import { createLogger } from '@art-lib/logger';

const logger = createLogger({
  writer: message => process.stdout.write(`${message.level}: ${message.text}\n`),
});

// Buffered until an output mode is selected.
logger.log({ level: 'info', text: 'Discovering files', ts: Date.now() });
logger.setOutputMode('normal');

logger.log({ level: 'warning', text: 'Cache directory missing', ts: Date.now() });
```

Messages have a `level`, string `text` and numeric `ts` timestamp. The optional writer receives each complete message. By default, the logger sends the text to the matching console method.

## Output modes

| Mode      | Messages written          |
| --------- | ------------------------- |
| `quiet`   | `warning` and `error`     |
| `normal`  | Everything except `debug` |
| `verbose` | All messages              |

Messages are buffered until `setOutputMode` is called. The selected mode filters the buffer and all subsequent messages.

## Development

Read the [Art Lib README](../../README.md) before contributing.

This package targets Node.js and uses `esbuild` for its entry point.

Available scripts:

- `npm run dev` — Watch for changes
- `npm run lint` — Check formatting, lint and types
- `npm run lint:fix` — Fix formatting and lint issues
- `npm run build` — Build the package
- `npm run build:clean` — Remove build artefacts
- `npm run test` — Run tests
- `npm run ci` — Run the CI pipeline

## Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under the [MIT licence](https://noodlestan.mit-license.org/).
