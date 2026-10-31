# Components: Art Lib

**Purpose:** Identify the components of Art Lib — packages, their contracts, and how they relate.

## Summary

Art Lib provides composable units for building CLI and tool experiences: a records library for finding, reading, and writing Art records on the filesystem, shared CLI infrastructure (operations, logger, config), and a set of thin framework wrappers that expose Commander, Clack, and OpenTUI while adding the shared wiring every CLI needs.

All components live under `libs/`. Framework wrappers follow one rule: **always expose the underlying framework instance/API** — customers are never blocked because an API is not reflected in the wrapper.

Frameworks adopted (see [Decision: Frameworks](./adr/frameworks.md)): Commander, `@clack/prompts`, OpenTUI.

## Core Libraries

### Operations (`@art-lib/operations`)

**Path:** `libs/operations`

**Status:** PLANNED — plan drafted at `_backlog/3-now/plan-add-operations/plan.md`

The shared CLI operation plumbing, extracted from `@art-works/workspace-cli` and `@art-md/bin` as one package with two subpath modules:

- `/model` — operation outcome types and factories (`OperationPending`/`Success`/`Failure`); operations conform to the `Message` interface of `@art-lib/logger`.
- `/log` — append-only operations log with `all`/`since`/`latest` queries; created with the logger and forwarding every operation to it.

### Logger (`@art-lib/logger`)

**Path:** `libs/logger`

**Status:** PLANNED

One logging interface for messages: a `Message` model with severity levels (`createMessage`, `createInfoMessage`, `createWarningMessage`, `createErrorMessage`, `createDebugMessage`) and a buffering logger — so messages are logged consistently before and after the environment is fully resolved — wrapping the actual log writer. The logger knows only messages; operations conform to `Message` structurally and it has no dependency on `@art-lib/operations`.

### Config (`@art-lib/config`)

**Path:** `libs/config`

**Status:** PLANNED

Infrastructure for CLI implementors to load, compile, and cache typed config modules — esbuild bundle-at-runtime with a content-hash cache. Config entry path, cache directory, and config shape are caller-supplied; the authoring surface (`defineConfig`, config types) always stays in each consumer package.

### FS Records (`@art-lib/fs-records`)

**Path:** `libs/fs-records`

**Status:** IMPLEMENTED

Generic record read/write modules for Art MD record files. Find, read, and filter record files across a search path, honouring gitignore and configured patterns. Exposes `discoverRecordFiles()`, `readRecordFileContent()`, and the `FSRecordFile`/`FSRecordsPattern` types.

Extension delivered by `_backlog/1-done/plan-add-fs-records-adapter/plan.md` (`DONE`, published as `@art-lib/fs-records@0.0.3`): the `FSRecordsAdapter` (discovery + content-source factory) and its per-file `FSContentSource`, which implements `ArtContentSource` from `@art-md/primitives` — the filesystem discovery and content-acquisition backend for the records chain. Naming and layering are chain-agreed in `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`: package `@art-lib/fs-records`, unit `FSRecordsAdapter`/`createFSRecordsAdapter`, method `discoverRecordFiles()`, persistence `writeContent(content)`; the adapter is not itself a content source (one URI per source, the adapter spans a search tree).

## Framework Wrappers

Thin wrappers, one per adopted framework. Each wrapper adds shared wiring without hiding the framework: the underlying instance/API is always reachable.

### Bin (`@art-lib/bin`)

**Path:** `libs/bin`

**Status:** PLANNED

**Wraps:** Commander.

Abstracts command construction, coordinating with config and context. Requires an IoC design that **preserves Commander's straightforward usefulness** — do not work against the library; on the contrary, help model how to wire context and logger _even before config loads_, so that config loading can use the same infrastructure. Exposes the underlying Commander `Command` instances.

### Prompts (`@art-lib/prompts`)

**Path:** `libs/prompts`

**Status:** PLANNED

**Wraps:** `@clack/prompts`.

The most wrapper-like unit: one model API around the prompt use cases — prompts, questions, choices. Questions and options are fed from specs/structured constants so that source code does not get tangled with question/option content. Designed with forward-looking use cases in mind, such as i18n of prompt content. Exposes the underlying Clack API.

### UI (`@art-lib/ui`)

**Path:** `libs/ui`

**Status:** PLANNED

**Wraps:** OpenTUI.

Not so much a wrapper as a **recipes library** for creating the basics of a persistent terminal UI — including the context/logger/config wiring shared with the rest of the stack. Exposes the underlying OpenTUI instance.

## Relationships

```
@art-lib/logger (messages) ◀─ @art-lib/operations (/model, /log — conform + forward)
@art-lib/config (loading infra for CLI implementors)

@art-lib/logger / @art-lib/operations / @art-lib/config ──▶ consumer CLIs (Art Works, Art MD, …)

Commander ──▶ @art-lib/bin ────┐
Clack ──────▶ @art-lib/prompts ─┼──▶ consumer CLIs
OpenTUI ────▶ @art-lib/ui ─────┘

@art-js/records (contracts) ◀── @art-lib/fs-records (FS backend, adapter delivered)
```
