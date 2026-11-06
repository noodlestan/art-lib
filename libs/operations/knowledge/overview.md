# Overview: Art Lib Operations

**Purpose:** Introduce the operations package: what it is, its definitions, its use cases, and how an operation runs.

## What

`@art-lib/operations` exposes two subpath modules. `/model` is the pure operation model — `OperationOutcome`, the `OperationPending`/`OperationSuccess`/`OperationFailure` types, and the `createGenericOperation()`, `createOperationSuccess()`, and `createOperationFailure()` factories. `/log` is the append-only operations log — `createOperationsLog(logger, options?)` returning `OperationsLog` with `log()`, `all()`, `since()`, and `latest()`. The package root re-exports both.

## Why

Every CLI invocation performs units of work that deserve a consistent record: when they started, whether they succeeded, what to show, and how long they took. The Art Workspace Cli and the Art MD bin carried ~60% identical plumbing for this — outcome types, pending/success/failure factories, a per-command log — and diverged in the details (hardcoded error-label maps, different query helpers). One shared model keeps those semantics identical across consumers, and one log gives them the same query vocabulary.

## Definitions

- **Operation** — one unit of work in a command invocation: its `operation` name, `ts` creation time, optional `finishedTs`, `outcome`, `message()`, and `timing()` (milliseconds once finished, `NaN` while pending).
- **Outcome** — `pending`, `success`, or `failure`. The level shown by the logger is derived from it: `pending` → `debug`, `success` → `info`, `failure` → `error`.
- **Pending operation** — built by `createGenericOperation(name, data?)`; carries the payload untouched and is not stored by the log.
- **Failure label** — an optional per-call prefix (`CloneError`, `ParseError`, …) applied by `errorSerialized()`; `error` keeps the raw message.
- **Operations log** — an append-only, per-invocation store of finished operations, created with the logger and forwarding every operation to it.

## Use Cases

| #   | Use case           | Behaviour                                                                                      |
| --- | ------------------ | ---------------------------------------------------------------------------------------------- |
| 1   | **Open work**      | `createGenericOperation('clone', { repo })` builds the pending operation; log it as `debug`.   |
| 2   | **Record success** | `createOperationSuccess(pending, message?)` finishes it; logged as `info` and stored.          |
| 3   | **Record failure** | `createOperationFailure(pending, error, { label })` finishes it; logged as `error` and stored. |
| 4   | **Show a reason**  | `message()` reports the given text (or `data.uri`), `errorSerialized()` adds the label.        |
| 5   | **Time the work**  | `timing()` returns `finishedTs - ts` once finished, `NaN` while pending.                       |
| 6   | **Query the run**  | `all()`, `since(timestamp)`, and `latest(count)` read the finished operations, in order.       |

## How It Works

An operation runs in three steps:

1. **Create** — `createGenericOperation(name, data?)` stamps `ts`, derives `level: 'debug'`, and freezes a pending operation with `outcome: 'pending'`.
2. **Finish** — `createOperationSuccess(pending, message?)` or `createOperationFailure(pending, error, { label? })` stamps `finishedTs`, derives the level, and freezes the finished operation.
3. **Log** — every `log(operation)` forwards the operation to `logger.log(...)` first; finished operations are then appended to the store. Pending operations pass through but are never stored.

Queries read the store only: `all()` returns a copy of every finished operation, `since(timestamp)` filters on creation time, and `latest(count)` returns the last `count` entries (`[]` for non-positive counts).

The published surface behind these cases is documented in [`design/operations.md`](design/operations.md).
