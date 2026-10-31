# FS Records - Adapter Contracts

Design decisions from the Art Records whiteboard, as agreed for `@art-lib/fs-records`.

## Decision: Two-unit layering

**Status:** Adopted

**Context:** The adapter spans a search tree (basePath + patterns), while a content source addresses exactly one URI. These are different responsibilities.

**Decision:** `FSRecordsAdapter` handles discovery and creates per-file `FSContentSource` instances. `FSContentSource` implements `ArtContentSource`. The adapter is NOT itself an `ArtContentSource`.

**Consequences:** Clean separation — discovery logic is reusable across files; each file gets its own content source with caching and persistence. Matches the `FSContentSource → ArtContentSource → ArtDocumentSource → ArtRecordCapsule` layering.

**Source:** Art Records whiteboard, `@art-lib/fs-records` contracts, agreed 2026-10-13.

## Decision: Content contract — strict read, persist-and-refresh write

**Status:** Adopted

**Context:** `ArtContentSource.readContent()` is frozen upstream at `Promise<string>` — it cannot return `undefined`, so it must throw for unreadable files.

**Decision:** `readContent()` throws on error. `writeContent(content)` persists the whole file and refreshes the in-memory cache so the next `readContent()` sees what was written.

**Consequences:** Content source is stateless per call — callers get deterministic behaviour. The adapter re-reads after `writeContent()` (line anchors computed against the given content stand).

**Source:** Art Records whiteboard, `@art-lib/fs-records` contracts, agreed 2026-10-13.

## Decision: Degrade-not-fail at discovery

**Status:** Adopted

**Context:** Discovery may encounter files that exist but are unreadable (permissions, encoding). Throwing on the first bad file would abort the entire discovery.

**Decision:** `discoverRecordFiles()` never throws for a single bad file — it returns the file with `error?` populated on `FSRecordFile`. Consumers filter on `FSRecordFile.error?` before calling `readContent()`.

**Consequences:** Tolerance lives at discovery, not at the content source. A single bad file does not abort a batch discovery.

**Source:** Art Records whiteboard, `@art-lib/fs-records` contracts, settled 2026-10-13.

## Decision: Discovery ordering — ascending absolute path

**Status:** Adopted

**Context:** Consumers need deterministic file ordering across runs and machines.

**Decision:** `discoverRecordFiles()` returns files sorted ascending by absolute path.

**Consequences:** Stable and reproducible. Already true in the implementation (`.sort()` on the flattened candidate set); promoted from incidental behaviour to explicit guarantee.

**Source:** Art Records whiteboard, `@art-lib/fs-records` contracts, settled 2026-10-13.

## Decision: Naming conventions

**Status:** Adopted

**Context:** The original package exported `findRecordFiles`, `FSRecordsPath`, `FSRecordsConfig`, and `searchPath`. These were renamed to align with the agreed chain contracts.

**Decision:** `findRecordFiles` → `discoverRecordFiles`, `FSRecordsPath` → `FSRecordsPattern`, `FSRecordsConfig` removed, `FSRecordFile.searchPath` → `FSRecordFile.basePath`.

**Consequences:** Consumers must use the new names. They shipped in `@art-lib/fs-records@0.0.3` (release commit `b815ddc`); the pre-rename names are no longer exported.

**Source:** Art Records whiteboard, `@art-lib/fs-records` contracts, agreed 2026-10-13.
