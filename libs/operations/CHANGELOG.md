# CHANGELOG

## 0.0.3

### Added

- Add an injectable operation formatter and a pipe-separated formatter for status symbols and elapsed time.
- Export reusable operation test helpers.

### Changed

- Use `@art-lib/logger` 0.0.4; translate operation outcomes into logger messages and levels.
- Consolidate model and log APIs at the package root.

### Removed

- Remove operation-level `level`, failure labels, and `errorSerialized()`.

### Tested

- Cover typed operation lifecycles, formatter output, logger forwarding, history queries, and error handling.

### Documented

- Update the README and architecture documents for the operation model, logger boundary, and formatter.

## 0.0.2

### Added

- Extend the three model factories with `<D>` generics and an optional `message` hook on `createGenericOperation`.
