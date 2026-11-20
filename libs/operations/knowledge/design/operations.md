# Design: Operations

**Purpose:** Describe the ownership boundaries and lifecycle that connect CLI operations to the logger.

`@art-lib/operations` provides a shared lifecycle model for CLI work and an operations log that adapts that model to `@art-lib/logger`.

## Operation model

The package supplies a base model, a generic pending factory, and success and failure types and factories. A CLI defines a typed pending variant for each operation kind, including its literal operation name and data shape. Its factory specialises the generic factory and may supply a `toText` function for the operation-specific detail.

The CLI also defines an `Operation` union from its specific pending variants and the common pending, success, and failure types. This keeps command-specific data typed while using the same completion and logging lifecycle for every operation.

Operation data and detail text remain client-owned. A CLI factory defines the information carried by an operation; the formatter decides which fields appear in the final log line and in what order.

## Logger boundary

The operations log receives a logger instance and formatter. It converts each operation into a logger `Message` rather than passing operation objects through as messages. The outcome determines the level: `pending` → `debug`, `success` → `info`, and `failure` → `error`. The formatter produces the message's string `text`, and the operation's start timestamp supplies `ts`.

The default formatter produces the ecosystem's pipe-separated line. One callback returns the ordered field values for an operation; the formatter adds the outcome symbol and, for completed states, elapsed time. A client can inject another formatter when it needs a different output format. The dependency remains one-way: operations uses the logger, while the logger has no operation-specific behaviour.

## Operation history

Each command invocation owns an operations log. The log forwards every operation state to the logger and retains completed states for querying. Pending states are forwarded as they occur and are excluded from the completed-operation history.

The log exposes `all()`, `since(timestamp)`, and `latest(count)` over completed states. Queries preserve event order and return copies, keeping the internal history private.

See the [README](../../README.md) for installation and usage, and the [ADRs](../adr/operations.md) for the design decisions.
