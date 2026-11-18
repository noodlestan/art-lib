# Overview: Art Lib Logger

`@art-lib/logger` buffers log messages until an output mode is selected, then sends accepted messages to a writer.

## API

- `createLogger({ writer? })` creates the logger. The optional writer receives a `Message`.
- A `Message` contains `level` (`debug`, `info`, `warning`, or `error`), `text` and `ts`.
- The logger exposes `log(message)` and `setOutputMode(mode)`.
- Modes are `quiet` (warnings and errors), `normal` (everything except debug) and `verbose` (all messages).

The default writer sends each message's text to the matching console method.

## Behaviour

Messages logged before `setOutputMode` are buffered. Setting a mode flushes them in order; later messages use the same level filter. The logger starts without a mode, so messages are not written until one is selected.

See the [design](design/logger.md) for the full API and the [ADR](adr/logger.md) for the key decisions.
