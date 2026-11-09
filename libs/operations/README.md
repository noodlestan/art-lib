# @art-lib/operations

> Operation outcome types and factories, and an append-only operations log that forwards every operation to the logger.

This package is part of the [Art Lib toolkit](../../README.md).

## Design

The package defines the operation model: one unit of work in a command invocation, carrying a pending, success, or failure outcome. Factories build the pending operation and then derive the finished one from it. The package also provides a thin, append-only operations log. Created alongside a logger, it forwards every operation to that logger and keeps the finished ones queryable.

Every operation doubles as a log message for [`@art-lib/logger`](../logger/README.md). It carries a level derived from its outcome — pending logs as debug, success as info, failure as error — so the logger consumes operations directly without ever learning what they are. That logger is the package's only dependency.

See also:

- [package knowledge](knowledge/index.md) — overview, design, and decision records
- [repository design record](../../knowledge/design/operations.md) — what a CLI needs from the package

## Usage

### Install

```bash
npm install @art-lib/operations
```

`@art-lib/logger` arrives as a dependency; import it wherever you create the logger.

### Configure

Create one operations log per command invocation, right after the logger. Every operation logged through it is forwarded to the logger, so resolve the output mode first:

```ts
import { createLogger } from '@art-lib/logger';
import { createOperationsLog } from '@art-lib/operations/log';

const logger = createLogger();

// Buffered messages flush as soon as the mode is resolved.
logger.setOutputMode(process.env.VERBOSE ? 'verbose' : 'normal');

// One log per command invocation; discard it when the invocation ends.
export const operations = createOperationsLog(logger);
```

The package root re-exports both subpaths, so `import { ... } from '@art-lib/operations'` works as well.

### Example

```ts
import {
  createGenericOperation,
  createOperationFailure,
  createOperationSuccess,
} from '@art-lib/operations';
import { operations } from './log.js';

const startedAt = Date.now();

const pending = createGenericOperation('clone', { repo });
operations.log(pending); // forwarded as `debug`; pending operations are not stored

try {
  const path = await clone(pending.data.repo);

  operations.log(createOperationSuccess(pending, `cloned ${path}`)); // stored
} catch (error) {
  // The label prefixes `errorSerialized()` only — `error` stays the raw message.
  operations.log(createOperationFailure(pending, error, { label: 'CloneError' })); // stored
}

// The log keeps finished operations only, in order:
operations.all(); // every finished operation
operations.since(startedAt); // created at or after `startedAt`
operations.latest(5); // the last five finished operations
```

### Options

| Function                                           | Arguments                                            | Returns            | Notes                                                               |
| -------------------------------------------------- | ---------------------------------------------------- | ------------------ | ------------------------------------------------------------------- |
| `createGenericOperation(name, data?, text?)`       | operation name, optional payload, optional text      | `OperationPending` | frozen; reports the payload as JSON by default; `timing()` is `NaN` |
| `createOperationSuccess(pending, text?)`           | a pending operation, optional success text           | `OperationSuccess` | falls back to the pending's own text                                |
| `createOperationFailure(pending, error, options?)` | a pending operation, any error-shaped value, options | `OperationFailure` | the options carry a label that prefixes `errorSerialized()`         |
| `createOperationsLog(logger, options?)`            | a logger, reserved options                           | `OperationsLog`    | forwards every operation; stores finished operations only           |

- **Payload** — carried on the operation untouched, from pending through to success or failure. By default the payload is serialised to JSON as the operation's text, until a success text overrides it.
- **Options** — the log accepts a second argument and deliberately ignores it; it is reserved for a future iteration.
- **Operations log** — offers `log`, `all`, `since` and `latest`. The query methods return copies, never the internal buffer.

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
