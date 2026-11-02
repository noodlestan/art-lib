# Art Lib Logger - Messages and Buffering

## Decision: Messages Only — No Operations Dependency

**Status:** Adopted

**Context:** The sibling `@art-lib/operations` package models operations (pending, success, failure) and an operations log. A logger shared by both packages could easily grow an operations concept of its own — operation-aware formatting, operation levels — and tie every consumer to the operation model even when it only needs to log a string.

**Decision:** The logger knows only messages. `Message` is one shape — `{ level, text(), ts }` — and operations (in `@art-lib/operations`) conform to it structurally. The package never imports operations and holds no operation concept.

**Consequences:** No dependency and no cycle between the packages; any producer that structurally conforms to `Message` can be logged. Operation-specific columns (name, timing) ride on the message as optional properties, consumed by formatters rather than by the logger.

**Source:** Plan: Add Logger (`_backlog/3-now/plan-add-logger/plan.md`), Decisions; repository record `knowledge/design/logger.md`.

## Decision: Split From `@art-lib/operations`

**Status:** Adopted

**Context:** The logger and the operation model were originally one concern in the operations package. The logger is effectful — it wraps the actual log writer — while the operation model is plain data.

**Decision:** The logger lives in its own package, `@art-lib/logger`; the operation model and the operations log stay in `@art-lib/operations`. Consumers that only need messages never pull in operations, and the log writer wrapping stays isolated.

**Consequences:** Two small packages with a one-way relationship: operations use the logger, never the reverse. Split per the milestone decision recorded in `_roadmap/3-now/milestone-art-lib-one/milestone.md`.

**Source:** Plan: Add Logger (`_backlog/3-now/plan-add-logger/plan.md`), Decisions.

## Decision: Buffer Until the Output Mode Is Set

**Status:** Adopted

**Context:** A CLI logs while its environment is still resolving — before config loads and before command options decide the output mode. A logger that wrote immediately would either emit with the wrong mode or drop those early messages.

**Decision:** `createLogger()` starts with an undefined output mode and a buffer. `log()` buffers until `setOutputMode(mode)` resolves it: `quiet` discards the buffer and then writes only `warning`/`error`; `verbose` flushes the buffer in order and then writes everything.

**Consequences:** Messages are logged consistently before and after the environment is fully resolved, with one code path for both. Setting the mode twice applies the same rule to an empty buffer — nothing is re-emitted.

**Source:** Plan: Add Logger (`_backlog/3-now/plan-add-logger/plan.md`), Decisions; repository record `knowledge/design/logger.md`.

## Decision: Injectable Formatter and Writer

**Status:** Adopted

**Context:** Consumers differ in their log-line columns (operation name, timing) and in where lines go (stderr, files, a reactive layer). A logger that hardcoded either would fork per consumer.

**Decision:** `createLogger(options?)` accepts a `LogFormatter` (`format(message): string[]`) and a `LogWriter` (`write(lines): void`). Defaults render the four-cell line and write it with `console.error`.

**Consequences:** Tests inject a mock writer and never touch `console.error`; consumers swap columns or sinks without forking the logger. The defaults are usable out of the box for a standard CLI.

**Source:** Plan: Add Logger (`_backlog/3-now/plan-add-logger/plan.md`), Decisions.
