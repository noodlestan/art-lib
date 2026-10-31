# Overview: FS Records

**Purpose:** Provide filesystem discovery and content acquisition for Art MD records.

## Purpose

`@art-lib/fs-records` is the FS backend for the Art Records chain: discover record files, read content, write content. It holds no record semantics and performs no template rendering.

## Design: Two Units

### `FSRecordsAdapter`

Created via `createFSRecordsAdapter(options)`. Owns the search tree (`basePath` + `patterns`). Provides `discoverRecordFiles(kinds?)` and `createContentSource(file)`. The adapter is NOT itself an `ArtContentSource`: it spans a search tree, while a content source addresses exactly one URI.

### `FSContentSource`

Created via `createFSContentSource(file)`. Implements `ArtContentSource` from `@art-md/primitives`. One per file. `readContent()` lazily loads and caches; `writeContent(content)` persists and refreshes the cache. URI is `file://{filename}`.

## Contracts

From the Art Records whiteboard (`$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`, `@art-lib/fs-records` contracts):

- **Content source is strict** — `readContent()` throws on error (upstream `Promise<string>` is frozen).
- **Discovery tolerates** — `discoverRecordFiles()` returns files with `error?` populated for unreadable files. Consumers filter on `FSRecordFile.error?` before calling `readContent()`.
- **Discovery ordering** — ascending absolute path, deterministic.
- **Naming** — `discoverRecordFiles`, `FSRecordsPattern`, `FSRecordFile.basePath`.

See Also: [Decisions: Adapter Contracts](./adr/adapter-contracts.md).

## Dependencies

- `@art-md/primitives` — the `ArtContentSource` contract.

## Real Consumers (usage evidence)

Both consumers depend on `@art-lib/fs-records@0.0.3` from their `main`:

- `@art-works/workspace-cli` (`$WORKSPACE/checkouts/art-works/cli/workspace/package.json`)
- `@art-js/test-records` (`$WORKSPACE/checkouts/art-js/tests/records/package.json`)

They are the evidence base for the exported API and the two-unit design — the package is consumed, not awaiting adoption.
