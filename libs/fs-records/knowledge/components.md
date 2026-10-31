# Components: FS Records

Module breakdown of the `@art-lib/fs-records` `src/` layout.

## `adapter/`

`FSRecordsAdapter` factory and types. `createFSRecordsAdapter(options)` returns an adapter that wraps discovery and creates content sources.

## `discover/`

`discoverRecordFiles(basePath, patterns, kinds?)`. Scans directories using glob patterns, respects gitignore, filters by kind. Returns `FSRecordFile[]` sorted ascending by absolute path.

## `files/`

Core types (`FSRecordFile`, `FSRecordsPattern`, `FSContentSource`), the content source factory (`createFSContentSource`), and `readRecordFileContent`.

## `private/`

Internal helpers: `globPath`, `findRecordFilesInPath`, `filterByKinds`, `createRecordFile`, `getGitIgnoredSet`, `normalizeExcludes`, `normalizePatterns`, `directoryExists`.

## `test/`

Test helpers: `makeMockRecordsConfig`, `makeTempDir`, `removeTempDirs`.
