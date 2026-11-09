# Overview: Art Lib Operations

**Purpose:** Introduce the operations package: what it is, its definitions, its use cases, and how an operation runs.

## What

The package defines the operation model: one unit of work in a command invocation, carrying a pending, success, or failure outcome. Factories build the pending operation and then derive the finished one from it. The package also provides a thin, append-only operations log. Created alongside a logger, it forwards every operation to that logger and keeps the finished ones queryable.

## Why

Every CLI invocation performs units of work that deserve a consistent record: when they started, whether they succeeded, what to show, and how long they took. The Art Workspace Cli and the Art MD bin each carried roughly 60% identical plumbing for this — outcome types, pending/success/failure factories, a per-command log — and diverged in the details, such as hardcoded error-label maps and different query helpers. One shared model keeps those semantics identical across consumers, and one log gives them the same query vocabulary.

## Definitions

- **Operation** — one unit of work in a command invocation. It records when it started, when it finished, whether it succeeded, what to show the user, and how long it took. The duration is not available while it is still pending.
- **Outcome** — pending, success, or failure. The level the logger shows is derived from it: pending logs as debug, success as info, failure as error.
- **Pending operation** — built by `createGenericOperation`. It carries the payload untouched, and the log never stores it.
- **Failure label** — an optional per-call prefix such as `CloneError` or `ParseError`, applied by `errorSerialized()`. The failure's own error always keeps the raw message.
- **Operations log** — an append-only store for one command invocation. It is created with the logger, forwards every operation to it, and keeps only the finished ones.

## Use Cases

| #   | Use case           | Behaviour                                                                                      |
| --- | ------------------ | ---------------------------------------------------------------------------------------------- |
| 1   | **Open work**      | `createGenericOperation('clone', { repo })` builds the pending operation; log it as `debug`.   |
| 2   | **Record success** | `createOperationSuccess(pending, text?)` finishes it; logged as `info` and stored.             |
| 3   | **Record failure** | `createOperationFailure(pending, error, { label })` finishes it; logged as `error` and stored. |
| 4   | **Show a reason**  | `text()` reports the given text, or the payload as JSON; `errorSerialized()` adds the label.   |
| 5   | **Time the work**  | `timing()` returns `finishedTs - ts` once finished, `NaN` while pending.                       |
| 6   | **Query the run**  | `all()`, `since(timestamp)`, and `latest(count)` read the finished operations, in order.       |

## How It Works

An operation runs in three steps:

1. **Create** — the factory `createGenericOperation(name, data?)` stamps the creation time, derives a debug level, and freezes a pending operation.
2. **Finish** — the success or failure factories — `createOperationSuccess` and `createOperationFailure` — stamp the completion time, derives the level, and freezes the finished operation.
3. **Log** — every `log(operation)` reaches the logger first; finished ones are then appended to the store. Pending operations pass through but are never stored.

Queries read the store only: `all` returns a copy of every finished operation, `since` filters on creation time, and `latest` returns the last few entries — an empty list for a non-positive count.

The published surface behind these cases is documented in [`design/operations.md`](design/operations.md).
