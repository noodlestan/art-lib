# Plan: Add FS Records Knowledge

**ID:** `add-fs-records-knowledge`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Document the `fs-records` package with a knowledge directory, improved README, and accurate guide.

**Description:** Create `knowledge/` with overview, components, and ADR files honouring the contracts agreed on the Art Records whiteboard. Update README and guide to reflect the adapter surface.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                | Purpose                                                                                               |
| ------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory                                                                              |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Domain resources directory                                                                            |
| `$PROJECT`   | Provided with Prompt         | This repository, where plan backlog, and all Art Lib implementation live. All code changes land here. |

## Summary

Document the `@art-lib/fs-records` package: README, guide, knowledge directory with overview, components, and ADR.

## Context

### Upstream Work

| Kind        | Path                                                         | Role                                                            |
| ----------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| Parking Lot | `$PROJECT/_backlog/_parking-lot.md`                          | Tracks short-term actionables, pending questions, and blockers. |
| Milestone   | `$PROJECT/_roadmap/3-now/milestone-art-lib-one/milestone.md` | Scope for this library's first version.                         |
| Whiteboard  | `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`      | Agreed contracts for the adapter layering and content source.   |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$PROJECT/_guide.md` (Model) — Repository layout, records management, conventions, and operating instructions. Relevant for Planning Work Item.

::READ `$PROJECT/knowledge/components.md` (Model) — Package components and planned packages. Relevant for Planning Work Item.

## Scope

Document the `@art-lib/fs-records` package surface: the adapter, content source, discovery, and types. Honour the contracts agreed on the Art Records whiteboard (`$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`). No code changes — documentation and knowledge only.

---

## Items:

| Iteration / Instructions                | Status  |
| --------------------------------------- | ------- |
| Iteration: Update FS Records README     | `READY` |
| Iteration: Verify FS Records Guide      | `READY` |
| Iteration: Add FS Records Knowledge Dir | `READY` |

### Iteration: Update FS Records README

**Id:** `update-readme`

**Status:** `READY`

**Purpose:** Replace the generic README with one that documents the adapter surface, exports, and basic usage.

**Description:** Update `libs/fs-records/README.md` to describe the package purpose, the two-unit design (`FSRecordsAdapter` + `FSContentSource`), the exported API, and a usage example.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./plan-add-fs-records-knowledge/instructions/update-readme.md`

**Changes:**

In `$PROJECT/libs/fs-records/README.md`:

- Describe the package purpose: filesystem discovery and content acquisition for Art MD records.
- Document the two-unit design: `FSRecordsAdapter` (discovery + factory) and `FSContentSource` (per-file `ArtContentSource`).
- List all public exports with one-line descriptions.
- Add a minimal usage example showing adapter creation, discovery, and content reading.
- Keep the existing Development and Copyright sections.

**Dependencies:**

- None.

#### Commits:

| ID              | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| --------------- | --------------------------------- | ------------ | ---- | ---------- |
| `update-readme` | Art Lib / `$PROJECT` / `building` | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `update-readme`

**Message:**

```text
docs(fs-records): Update README with adapter surface and usage example.
```

### Iteration: Verify FS Records Guide

**Id:** `verify-guide`

**Status:** `READY`

**Purpose:** Verify the `_guide.md` is accurate and update it to reference the knowledge directory.

**Description:** Review `libs/fs-records/_guide.md` for accuracy against the current package layout and exports. Update the Recommended Reading and Knowledge References sections to point to the new `knowledge/` directory.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./plan-add-fs-records-knowledge/instructions/verify-guide.md`

**Changes:**

In `$PROJECT/libs/fs-records/_guide.md`:

- Verify the Package Layout section matches the actual `src/` structure (now has `files/`, `discover/`, `adapter/`, `private/`, `test/`).
- Update Knowledge References to point to `knowledge/index.md`.
- Verify the Recommended Reading links resolve.
- Keep existing Operating Instructions unchanged.

**Dependencies:**

- None.

#### Commits:

| ID             | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| -------------- | --------------------------------- | ------------ | ---- | ---------- |
| `verify-guide` | Art Lib / `$PROJECT` / `building` | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `verify-guide`

**Message:**

```text
docs(fs-records): Update guide with current layout and knowledge references.
```

### Iteration: Add FS Records Knowledge Dir

**Id:** `add-knowledge-dir`

**Status:** `READY`

**Purpose:** Create the `knowledge/` directory with overview, components, and ADR files.

**Description:** Create `knowledge/index.md` (entry point with document table and layout), `knowledge/overview.md` (package purpose, design, contracts), `knowledge/components.md` (module breakdown), and `knowledge/adr/adapter-contracts.md` (decisions from the Art Records whiteboard). The ADR records the two-unit layering, content contract, degrade-not-fail, discovery ordering, and naming conventions agreed across the chain.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./plan-add-fs-records-knowledge/instructions/add-knowledge-dir.md`

**Changes:**

In `$PROJECT/libs/fs-records/knowledge/`:

Create `index.md`:

- Document table linking to `overview.md`, `components.md`, and `adr/adapter-contracts.md`.
- Package layout section matching actual `src/` structure.
- Related knowledge links.

Create `overview.md`:

- Package purpose: filesystem discovery and content acquisition.
- Two-unit design: `FSRecordsAdapter` (discovery + factory) vs `FSContentSource` (per-file `ArtContentSource`).
- Contract summary: content source is strict (throws), discovery tolerates (`error?`).
- Dependency on `@art-md/primitives` for `ArtContentSource` contract.

Create `components.md`:

- Module breakdown: `discover/`, `files/`, `adapter/`, `private/`, `test/`.
- Responsibility of each module.
- Key types and their roles.

Create `adr/adapter-contracts.md`:

- Decision: Two-unit layering (adapter vs content source).
- Decision: Content contract — `readContent()` throws, `writeContent()` persists and refreshes cache.
- Decision: Degrade-not-fail at discovery (`FSRecordFile.error?`).
- Decision: Discovery ordering — ascending absolute path.
- Decision: Naming conventions (`discoverRecordFiles`, `FSRecordsPattern`, `FSRecordFile.basePath`).
- Each decision with Status, Context, Decision, Consequences.
- Reference the whiteboard as the source of agreements.

**Dependencies:**

- Iteration: Update FS Records README.
- Iteration: Verify FS Records Guide.

#### Commits:

| ID                  | Repository / Checkout / Branch    | Policy       | Hash | Status     |
| ------------------- | --------------------------------- | ------------ | ---- | ---------- |
| `add-knowledge-dir` | Art Lib / `$PROJECT` / `building` | `AUTONOMOUS` |      | `AUTHORED` |

##### Commit: `add-knowledge-dir`

**Message:**

```text
docs(fs-records): Add knowledge directory with overview, components, and ADR.
```

---

## Coordination

### Not In Scope

- None.

### Evidence

- None.

### Findings

- None.

### Decisions

- **ADR records honour whiteboard contracts (2026-10-18).** The ADR file `adapter-contracts.md` records decisions agreed on the Art Records whiteboard (`$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`): two-unit layering, content contract, degrade-not-fail, discovery ordering, and naming. Each decision references the whiteboard as the source of agreement.

### Knowledge to Update

- `$PROJECT/libs/fs-records/knowledge/` — created by this plan.

### Follow Ups

- None.

### Feedback

- None.
