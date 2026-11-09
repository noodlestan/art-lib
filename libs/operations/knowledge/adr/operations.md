# Art Lib Operations - Model and Log

## Decision: One Package, Two Subpath Modules

**Status:** Adopted

**Context:** The Art Workspace Cli and the Art MD bin each carried their own operation model and operations log — roughly 60% identical plumbing across the two CLIs. The extraction could ship as three published packages (model, logger, log) or as fewer surfaces.

**Decision:** Ship one package, `@art-lib/operations`, with two subpath modules — `/model` (operation types and factories) and `/log` (the operations log) — with the package root re-exporting both. The buffering logger lives in `@art-lib/logger`.

**Consequences:** One version surface and one changelog for ~185 lines of dedup; consumers install a single package and import either subpath. Separate version surfaces for the model and the log would cost more to maintain than the dedup saves.

**Source:** Plan: Add Operations (`_backlog/1-done/plan-add-operations/plan.md`), Decisions.

## Decision: Operations Conform to `Message`

**Status:** Adopted

**Context:** Operations must reach the logger, but the logger is shared by producers that only ever log a plain string. Teaching the logger about operations would tie every consumer to this package.

**Decision:** An operation structurally satisfies the `Message` interface of `@art-lib/logger`. Its level is derived from the outcome — pending, success and failure log as debug, info and error — and the text an operation reports is the very member the logger reads. The logger therefore consumes operations directly and never learns what they are.

**Consequences:** The dependency runs one way: operations → logger, never the reverse, and no cycle exists between the packages. Operation-specific columns (`operation`, `timing`) ride on the message for formatters to consume; the default logger formatter already renders them.

**Source:** Plan: Add Operations (`_backlog/1-done/plan-add-operations/plan.md`), Decisions; `knowledge/design/operations.md`.

## Decision: Created With the Logger, Forward Every Operation

**Status:** Adopted

**Context:** The log has two jobs: keep the finished operations of one command invocation queryable, and make sure everything an operation says reaches the logger. Two sinks would risk the log and the logger disagreeing about what happened.

**Decision:** `createOperationsLog(logger, options?)` takes the logger as its only input and forwards every `log(operation)` call to `logger.log(...)` first, then appends finished operations to its own store. Pending operations pass through but are never stored.

**Consequences:** One source of truth — the logger sees every operation the log sees, at the moment it is recorded — and the store keeps finished operations only, so `all()`/`since()`/`latest()` answer "what finished" without pending noise. The one-way dependency keeps the log testable against a mock `LoggerAPI`.

**Source:** Plan: Add Operations (`_backlog/1-done/plan-add-operations/plan.md`), Findings; `knowledge/design/operations.md`.

## Decision: Per-Call Failure Label

**Status:** Adopted

**Context:** The Art Workspace Cli mapped command names to hardcoded error labels (`errorLabels`) so a failure could be serialized as `CloneError: …`. The mapping lived in the consumer, keyed by command, and any new command needed an entry.

**Decision:** `createOperationFailure(pending, error, { label? })` takes the label at the call site. `error` keeps the raw message; `errorSerialized()` prefixes the label only when one was given.

**Consequences:** The label travels with the failure, so new commands need no registry entry and consumers that want no prefix simply omit the option. The model carries no command vocabulary of its own.

**Source:** Plan: Add Operations (`_backlog/1-done/plan-add-operations/plan.md`), Decisions.
