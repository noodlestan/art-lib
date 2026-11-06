# Knowledge: Art Lib Operations

`@art-lib/operations` provides the shared CLI operation model and the append-only operations log.

## Documents

| Document                   | Purpose                                                                        |
| -------------------------- | ------------------------------------------------------------------------------ |
| [overview.md](overview.md) | What the package is, its definitions, its use cases, and how an operation runs |

## Design Documents

| Document                                     | Purpose                                                             |
| -------------------------------------------- | ------------------------------------------------------------------- |
| [design/operations.md](design/operations.md) | Published surface, the operation model, the log contract, and usage |

## Decision Records

| Record                                 | Purpose                                                                                |
| -------------------------------------- | -------------------------------------------------------------------------------------- |
| [adr/operations.md](adr/operations.md) | Two subpaths in one package, operations as messages, one-way logger dependency, labels |

## Related Knowledge

- `../../../knowledge/design/operations.md` — repository-level design record: what a CLI needs from the package.
- `../../logger/knowledge/index.md` — the logger package every operation is forwarded to.
