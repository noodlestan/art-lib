# Design: Operations

**Purpose:** The published surface of `@art-lib/operations` — what it exports, the contracts it guarantees, and how a consumer calls it.

Install with `npm install @art-lib/operations`.

## Public Surface

The package exposes two entry points: `@art-lib/operations/model` for the operation types and factories, and `@art-lib/operations/log` for the log. The package root re-exports both, so consumers can import from either.

### Factories

These four functions are the only values the package exports. Everything else is a type.

| Function                                           | What it does                                                                                                          |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `createGenericOperation(name, data?, text?)`       | Opens a pending operation. By default its text is the payload serialised to JSON, unless a text function is supplied. |
| `createOperationSuccess(pending, text?)`           | Finishes a pending operation as a success, optionally overriding the text.                                            |
| `createOperationFailure(pending, error, options?)` | Finishes a pending operation as a failure. The options carry a label for `errorSerialized()`.                         |
| `createOperationsLog(logger, options?)`            | Creates the per-invocation log around a logger. The second argument is reserved and ignored.                          |

### Types worth knowing

- **`OperationPending<D>`, `OperationSuccess<D>`, `OperationFailure<D>`** — the three states of a single operation. Each is generic over its payload, so the data handed to a pending operation comes back typed on the finished one. A failure additionally carries the raw error text and a labelled `errorSerialized()`.
- **`OperationsLog`** — what the log exposes: `log`, `all`, `since`, and `latest`, described in the log contract below.
- **`LoggableOperation`** — the argument type of `log`. It is a logger message that also carries an outcome, which is exactly what an operation is.
- **`AnyFinishedOperation`** — what the queries return: a success or a failure. Pending operations never reach them.

An operation is a flat record: its name, creation time, optional completion time, outcome, level, the text to show, and a `timing()` that reports the duration once finished and `NaN` while pending. The payload travels along in `data`.

## Model Contract

| Rule          | Behaviour                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| Frozen        | Every factory returns `Object.freeze(...)`; operations are immutable once created.                              |
| Derived level | `pending → debug`, `success → info`, `failure → error` — the producer derives, never the logger.                |
| Reported text | An operation's text is the member the logger reads, so an operation is logged as a message without translation. |
| `timing()`    | `finishedTs - ts` once finished; `NaN` while pending.                                                           |
| Failure label | `error` is always the raw message; `errorSerialized()` prefixes `label` only when given.                        |

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
