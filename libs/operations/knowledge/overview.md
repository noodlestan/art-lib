# Overview: Art Lib Operations

**Purpose:** Introduce the operation model, its relationship to CLI-owned operation types, and how the operations log forwards and records work.

## What

`@art-lib/operations` provides a common lifecycle model and operations log for CLI work. A CLI defines typed pending operations for its own commands, using the base model and generic factory. Completion factories create success and failure states.

The operations log adapts these operation states into `@art-lib/logger` messages. It derives the message level from the outcome, uses a formatter to produce the text, forwards every message to an injected logger, and keeps completed operations available for queries.

## Why

CLI commands perform domain-specific work but share the same lifecycle: work starts, then succeeds or fails. The package supplies common state and logging behaviour, while each CLI keeps ownership of its operation names, data, and display fields. This gives consumers consistent lifecycle semantics without making the logger understand operations.

## Definitions

- **Operation** — a unit of CLI work with an operation name, data, start timestamp, and outcome.
- **Pending operation** — the initial state created by a CLI-specific factory built on the generic factory. Its `toText` function supplies operation-specific detail.
- **Completed operation** — a success or failure state created by a completion factory from a pending operation.
- **Operation formatter** — converts an operation into ordered display fields and a log string. The default pipe-separated formatter adds the outcome symbol and elapsed time.
- **Operations log** — a per-command record that forwards every operation to the logger and retains completed operations for querying.

## Use Cases

| Use case        | Behaviour                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Create work     | A CLI-specific factory sets the operation name and typed data, then returns a pending operation.                               |
| Report progress | Logging the pending operation sends a `debug` message through the logger.                                                      |
| Complete work   | A completion factory creates a success (`info`) or failure (`error`) state from the pending operation.                         |
| Format output   | The CLI supplies one callback that returns the ordered fields; the default formatter renders the standard pipe-separated line. |
| Query a run     | The operations log retains completed states for `all()`, `since(timestamp)`, and `latest(count)` queries.                      |

## How It Works

1. The CLI creates a typed pending operation with its own factory and logs it.
2. The operations log maps the outcome to a logger level and formats the operation into a string.
3. The log forwards `{ level, text, ts }` to the injected logger.
4. The CLI completes the operation with a success or failure factory and logs the resulting state.
5. The operations log forwards the completed state and stores it for queries.

See the [design](design/operations.md) for component responsibilities and the [ADRs](adr/operations.md) for the key decisions.
