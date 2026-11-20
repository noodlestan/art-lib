# @art-lib/operations

> Model CLI operations and forward their formatted messages to `@art-lib/logger`.

This package is part of the [Art Lib toolkit](../../README.md).

## Install

```bash
npm install @art-lib/operations
```

Import public operations APIs from `@art-lib/operations`.

## Use the generic operation model

The generic factory creates a pending operation from a name, typed data, and an optional function that supplies its detail text. Shared factories create its success or failure state.

```ts
import { createLogger } from '@art-lib/logger';
import {
  createGenericOperation,
  createOperationFailure,
  createOperationSuccess,
  createOperationsLog,
  createPipeSeparatedFormatter,
} from '@art-lib/operations';

const logger = createLogger();
logger.setOutputMode('normal');

const operations = createOperationsLog(logger, {
  formatter: createPipeSeparatedFormatter(operation => [operation.operation, operation.text()]),
});

const uri = 'notes.art';
const pending = createGenericOperation('parse', { uri }, () => uri);
operations.log(pending);

try {
  const document = await parse(uri);
  operations.log(createOperationSuccess(pending, `parsed ${document.name}`));
} catch (error) {
  operations.log(createOperationFailure(pending, error));
}
```

The formatter callback returns the ordered field values for an operation. The default pipe-separated formatter adds an outcome symbol and, for completed operations, the elapsed time. The operations log derives the logger level from the outcome—`pending` to `debug`, `success` to `info`, and `failure` to `error`—then forwards a `{ level, text, ts }` message to the injected logger.

## Define CLI-specific operations

A CLI can define a typed pending operation and one factory for each operation kind. Each factory specialises the shared model with a literal operation name, a typed data shape, and operation-specific detail text. The shared success and failure factories handle completion for all operation kinds.

```ts
import {
  createGenericOperation,
  type OperationPending,
  type OperationSuccess,
  type OperationFailure,
} from '@art-lib/operations';

export type PullData = {
  checkout?: Checkout;
  branch: string;
};

export type PullPending = OperationPending<PullData> & {
  operation: 'pull';
};

export function createPullOperation(checkout: Checkout, branch: string): PullPending {
  const data = { checkout, branch };
  const toText = () => `from origin/${branch}`;

  return createGenericOperation('pull', data, toText);
}

export type Operation = PullPending | OperationPending | OperationSuccess | OperationFailure;
```

A CLI's complete `Operation` union combines its specific pending types—such as `ClonePending`, `PushPending`, and `PullPending`—with the common pending, success, and failure types. Its formatter callback selects the fields for the CLI's standard output layout.

## Operations log

Create one operations log with a logger and formatter for each command invocation. Every logged operation is converted to a logger message and forwarded. Completed operations are retained for `all()`, `since(timestamp)`, and `latest(count)` queries; pending operations are forwarded as well.

The standard pipe-separated format can produce output such as:

```text
⏳ | Art MD | art-md | pull | from origin/main |
🔴 | Workspace Tooling | workspace-tooling | pull | Could not read from remote repository. | (1224ms)
⏳ | Art MD | art-md | scan-checkout-state | art-md |
🟢 | Art MD | art-md | pull | from origin/main | (3317ms)
```

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
