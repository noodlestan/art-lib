# Art Lib Logger — Messages and Buffering

## Decision: Messages Only — No Operations Dependency

**Status:** Adopted

**Context:** The logger is shared infrastructure and should not depend on the domain-specific operation model.

**Decision:** The logger accepts messages shaped as `{ level, text, ts }`. It has no concept of operations and does not import `@art-lib/operations`.

**Consequences:** Any producer can log a message with this shape without introducing a dependency from the logger to that producer's domain.

## Decision: Buffer Until the Output Mode Is Set

**Status:** Adopted

**Context:** A CLI may log before it knows which output mode to use.

**Decision:** `createLogger()` buffers messages until `setOutputMode(mode)` is called, then flushes them in order using that mode's filter. Later messages use the same filter: `quiet` writes warnings and errors, `normal` excludes debug, and `verbose` writes all messages.

**Consequences:** Messages logged before mode selection follow the same rules as later messages. Changing the mode does not replay messages already written.

## Decision: Injectable Writer

**Status:** Adopted

**Context:** Consumers may need to forward logs to a specific logging infrastructure rather than use the built-in console output.

**Decision:** `createLogger({ writer })` accepts an optional `LogWriter`, a callback that receives a `Message` with its level, text and timestamp. The default writer sends the message text to the corresponding console method.

**Consequences:** Consumers can route messages to their own logging infrastructure, while tests can inject a writer without writing to the console.
