# Design: Operations

**Purpose:** Describe what a CLI needs from `@art-lib/operations` — the operation model and the operations log — as evidenced by the Art MD bin and Art Workspace Cli consumers.

**Planned package:** `@art-lib/operations` — `_backlog/3-now/plan-add-operations/plan.md`

## Operation

An operation records one unit of work in a command invocation:

- `operation` — its name, such as `clone`, `push`, `parse`, `serialize`, or `command`.
- `ts` and `finishedTs` — creation and completion times.
- `outcome` — `pending`, `success`, or `failure`.
- `message()` — what to show: an input uri, a given message, or the error reason.
- `timing()` — duration in milliseconds once finished; `NaN` while pending.

Failures add `error` (the raw error message) and `errorSerialized()`, which prefixes a caller-supplied label (`ParseError`, `CloneError`, …).

**Operations are messages.** An operation conforms to the `Message` interface of `@art-lib/logger` (level derived from the outcome: pending → debug, success → info, failure → error). The logger itself never learns about operations.

## Creators

- `createGenericOperation(name, data?)` — builds a pending operation; used for the `command` operation that opens each invocation.
- `createOperationSuccess(pending, message?)` — moves a pending operation to success.
- `createOperationFailure(pending, error, { label? })` — moves a pending operation to failure; the per-call `label` replaces the hardcoded per-command error-label maps consumers used to carry.

Success and failure are derived generically from the pending instance — consumers never write per-kind factories.

## Subpath Modules

- `/model` — the types and creators above.
- `/log` — the operations log below.

## OperationsLog

Append-only log of the operations performed during a command invocation. **Created with the logger** — `createOperationsLog(logger, options?)` — and forwards every operation it records to `logger.log(...)`. Created per command; discarded at the end of the invocation. Its append-only nature means it can be replayed or streamed by a future reactive layer.

| member           | semantics                                               |
| ---------------- | ------------------------------------------------------- |
| `log(operation)` | forward the operation to the logger; append if finished |
| `all()`          | all finished operations, in order                       |
| `since(ts)`      | finished operations after a timestamp                   |
| `latest(n)`      | the last `n` finished operations                        |

Pending operations pass through to the logger (buffered there until the output mode is set) but are not stored; the store keeps finished operations only.

## Consumer Wiring

```ts
const logger = createLogger({ formatter, writer }); // @art-lib/logger
const operations = createOperationsLog(logger, options); // forwards to logger.log

// per command:
const pending = createGenericOperation('clone', { repo });
ctx.operations.log(pending);
// ...work...
ctx.operations.log(
  ok
    ? createOperationSuccess(pending, msg)
    : createOperationFailure(pending, err, { label: 'CloneError' }),
);
```

`ctx.operations` is the `OperationsLog` instance; every recorded operation is forwarded to the logger and finished ones are queryable via `all()` / `since()` / `latest()`.

## Sources

- Art MD bin operations: `$ART_MD/cli/bin/knowledge/design/operations.md`
- Art Workspace Cli operations log: `$ART_WORKS/cli/workspace/knowledge/design/operations-log.md`
