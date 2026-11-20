# Decisions: Art Lib Operations

**Purpose:** Record the decisions that define client ownership, logger integration, and operation history.

## Decision: Client-Specific Operations

**Status:** Adopted

**Decision:** A CLI defines typed operation variants and one factory per operation kind, using the base operation model and generic factory. The success and failure factories complete those operations.

**Consequences:** Clients own operation names and data shapes while lifecycle behaviour stays consistent across CLIs.

## Decision: Translate Operations at the Logger Boundary

**Status:** Adopted

**Decision:** The operations log converts each operation into a logger `Message`. It derives the level from the outcome and obtains the text from an injected formatter. The default pipe-separated formatter uses one callback that returns ordered field values, then adds the outcome symbol (`⏳`, `🟢`, or `🔴`) and elapsed time.

**Consequences:** The operations package adapts domain operations to the logger's generic message model; the logger remains operation-agnostic.

## Decision: Forward Every Operation and Retain Completions

**Status:** Adopted

**Decision:** Each command invocation creates an operations log with a logger and formatter. The log forwards every operation and retains completed operations for queries.

**Consequences:** Logger output and operation history follow the same event stream, while queries focus on completed work.
