# CHANGELOG

## 0.0.3

### Changed

- **Update dependencies** - `@art-md/primitives@0.0.6`

# CHANGELOG

## 0.0.2

### Added

- **discoverRecordFiles():** Scan directory using cumulative path globs and rules and return record file descriptors. Accepts `(basePath, patterns: FSRecordsPattern[], kinds?)`.

- **readRecordFileContent():** Reads contents of record file and caches it in record descriptor.

- **FSRecordsAdapter:** Factory (`createFSRecordsAdapter`) for discovering record files and creating per-file content sources.

- **FSContentSource:** Per-file `ArtContentSource` implementation (`createFSContentSource`) with lazy `readContent()`, `writeContent()`, and `file://{filename}` URI scheme.

- **Types:** `FSRecordsPattern`, `FSRecordFile`, `FSRecordsAdapter`, `FSRecordsAdapterOptions`, `FSContentSource`.

- **Dependency:** `@art-md/primitives@0.0.5` (`ArtContentSource` contract).
