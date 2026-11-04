# Knowledge: Art Lib Logger

`@art-lib/logger` provides the message model and a buffering logger for CLIs.

## Documents

| Document                   | Purpose                                                                  |
| -------------------------- | ------------------------------------------------------------------------ |
| [overview.md](overview.md) | What the package is, its definitions, its use cases, and how a log works |

## Design Documents

| Document                             | Purpose                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------- |
| [design/logger.md](design/logger.md) | Published surface, buffering contract, output modes, log line, and writer |

## Decision Records

| Record                         | Purpose                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------- |
| [adr/logger.md](adr/logger.md) | Messages only, buffer until the mode is set, injectable formatter and writer |

## Related Knowledge

- `../../../knowledge/design/operations.md` — operations conform to `Message` and forward to the logger.
