# Design: Operations

**Purpose:** The published surface of `@art-lib/operations` — what it exports, the contracts it guarantees, and how a consumer calls it.

Install with `npm install @art-lib/operations`.

## Public Surface

The root export re-exports both subpaths; each subpath entry point is also reachable on its own:

```ts
// @art-lib/operations — both modules
// @art-lib/operations/model — the operation model
// @art-lib/operations/log — the operations log

type OperationOutcome = 'pending' | 'success' | 'failure';

type OperationBase = {
  readonly operation: string;
  readonly ts: number;
  readonly finishedTs?: number;
  readonly outcome: OperationOutcome;
  message(): string;
  timing(): number; // ms once finished; NaN while pending
  readonly level: MessageLevel; // pending → debug, success → info, failure → error
  text(): string; // aliases message(): Message conformance
};

type OperationPending<D = unknown> = OperationBase & {
  readonly outcome: 'pending';
  readonly data?: D;
};

type OperationSuccess<D = unknown> = OperationBase & {
  readonly outcome: 'success';
  readonly data?: D;
};

type OperationFailure<D = unknown> = OperationBase & {
  readonly outcome: 'failure';
  readonly data?: D;
  readonly error: string;
  errorSerialized(): string;
};

function createGenericOperation(name: string, data?: unknown): OperationPending;

function createOperationSuccess(pending: OperationPending, message?: string): OperationSuccess;

function createOperationFailure(
  pending: OperationPending,
  error: unknown,
  options?: { label?: string },
): OperationFailure;

type AnyFinishedOperation = OperationSuccess | OperationFailure;
type LoggableOperation = Message & { outcome: string };

type OperationsLog = {
  log(operation: LoggableOperation): void;
  all(): AnyFinishedOperation[];
  since(timestamp: number): AnyFinishedOperation[];
  latest(count: number): AnyFinishedOperation[];
};

type OperationsLogOptions = unknown; // reserved; ignored

function createOperationsLog(logger: LoggerAPI, options?: OperationsLogOptions): OperationsLog;
```

- `createGenericOperation` — the pending opener for a unit of work; `message()` reports `data.uri` when the payload carries one, otherwise `''`.
- `createOperationSuccess` / `createOperationFailure` — derive the finished operation from the pending one: same `operation`, `ts`, and `data`; new `finishedTs`, `outcome`, and level.
- `createOperationsLog` — the per-invocation log; `@art-lib/logger`'s `LoggerAPI` is its only input.

`OperationOutcome`, `OperationBase`, `OperationPending`, `OperationSuccess`, `OperationFailure`, `AnyFinishedOperation`, `LoggableOperation`, `OperationsLog`, and `OperationsLogOptions` are types, not values — the value surface is the four factory functions.

## Model Contract

| Rule                         | Behaviour                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| Frozen                       | Every factory returns `Object.freeze(...)`; operations are immutable once created.               |
| Derived level                | `pending → debug`, `success → info`, `failure → error` — the producer derives, never the logger. |
| `text()` aliases `message()` | Structural conformance to `Message` of `@art-lib/logger`; the logger needs no adapter.           |
| `timing()`                   | `finishedTs - ts` once finished; `NaN` while pending.                                            |
| Failure label                | `error` is always the raw message; `errorSerialized()` prefixes `label` only when given.         |

Success and failure are derived generically from the pending instance — consumers never write per-kind factories, and the payload (`data`) travels across the transition untouched.

## Log Contract

| Member             | Semantics                                                         |
| ------------------ | ----------------------------------------------------------------- |
| `log(operation)`   | forwards to `logger.log(...)`; appends when `outcome` is finished |
| `all()`            | every finished operation, in order — a copy of the store          |
| `since(timestamp)` | finished operations with `ts >= timestamp`                        |
| `latest(count)`    | the last `count` finished operations; `[]` when `count <= 0`      |

The log is created with the logger and has a one-way dependency: operations → logger. Pending operations pass through to the logger (buffered there until the output mode is set) but are not stored; the store keeps finished operations only. Queries always return copies, so callers can never mutate the internal buffer.

## Usage

```ts
import { createLogger } from '@art-lib/logger';
import {
  createGenericOperation,
  createOperationFailure,
  createOperationSuccess,
  createOperationsLog,
} from '@art-lib/operations';

const logger = createLogger();
logger.setOutputMode('normal');

const operations = createOperationsLog(logger);

const pending = createGenericOperation('parse', { uri: 'notes.art' });
operations.log(pending); // forwarded as debug; not stored

try {
  const document = await parse(pending.data.uri);

  operations.log(createOperationSuccess(pending, `parsed ${pending.data.uri}`)); // info + stored
} catch (error) {
  operations.log(createOperationFailure(pending, error, { label: 'ParseError' })); // error + stored
}

operations.latest(1); // the parse operation, finished
```

The repository-level requirements this design answers live in [`../../../../knowledge/design/operations.md`](../../../../knowledge/design/operations.md); the reasoning behind the shape is recorded in [`../adr/operations.md`](../adr/operations.md).
