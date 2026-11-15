# CHANGELOG

## 0.0.3

### Added

- Add `createLogger()` with `log()` and `setOutputMode()` for buffering messages until the output mode is selected.
- Add `quiet`, `normal`, and `verbose` modes to filter `debug`, `info`, `warning`, and `error` messages.
- Allow injecting a `LogWriter`; default to writing each message to the matching console method.
- Export the `Message`, `MessageLevel`, `OutputMode`, `LoggerOptions`, `LogWriter`, and `LoggerAPI` types.
