# Milestone: Art Lib One

**ID:** `art-lib-one`

**Status:** `WORKING`

**Template:** `$DOMAINS/milestones/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Provide composable units for Cli experiences.

**Description:** This milestone is driven by use cases surfaced in CLIs under development.

## Mandatory Reading

::READ `$DOMAINS/milestones/structures/milestone.art` (Structure) — Defines the milestone structure and nested types.

---

## Path Variables

| Variable     | Resolved Path             | Purpose                               |
| ------------ | ------------------------- | ------------------------------------- |
| `$WORKSPACE` | Current working directory | Workspace root directory              |
| `$PROJECT`   | Provided with prompt      | Where work execution is taking place. |

## Summary

Provide composable units for Cli as use cases surfaced in CLIs under development.

## Context

### Upstream Work

| Kind        | Path                                | Role                                                            |
| ----------- | ----------------------------------- | --------------------------------------------------------------- |
| Parking Lot | `$PROJECT/_backlog/_parking-lot.md` | Tracks short-term actionables, pending questions, and blockers. |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `write-milestone` — Writes milestones from roadmaps and backlogs. Required for Planning Work Item.

### Domains

| Domain / Path                                 | Description                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |
| Domain: Roadmaps `$DOMAINS/roadmaps/index.md` | Roadmaps and milestones coordination.                                              |

### Knowledge

::READ `knowledge/overview.md` (Model) — Framework wrappers and capabilities. Relevant for Planning Work Item.

::READ `knowledge/components.md` (Model) — Package components and planned packages. Relevant for Planning Work Item.

---

## Phases

| Index | Name                   | Status    |
| ----- | ---------------------- | --------- |
| 1     | Establish Lib baseline | `WORKING` |
| 2     | Consolidate            | -         |
| 3     | Decompose              | -         |

### Phase: 1 — Establish Lib baseline

**Goal:** Deliver the first use cases from Art Work Cli.

**Description:** Create the art-lib repository, scaffolding tools and tests, and expose APIs as they surface during Art Work Cli development.

**Status:** `WORKING`

**Dependencies:**

- None.

### Phase: 2 — Consolidate

**Goal:** Consolidate the package surface and internal organisation.

**Description:** Structural refactoring, performance optimizations, abstractions, knowledge.

**Status:** -

**Dependencies:**

- None.

### Phase: 3 — Integrate

**Goal:** Integrate Art JS

**Description:** Use Art JS records library to parse, extract, update, serialize.

**Status:** -

**Dependencies:**

- Plan: Art JS

---

## Items:

| Phase | Resource / Record                                                                                             | Status     |
| ----- | ------------------------------------------------------------------------------------------------------------- | ---------- |
| 1     | Plan: Create Art Lib Project and Repo `_backlog/1-done/plan-create-art-lib-project-repo/plan.md`              | `DONE`     |
| 1     | Plan: Extract Read/Write Records to Art Lib `_backlog/1-done/plan-extract-read-write-records-art-lib/plan.md` | `DONE`     |
| 1     | Plan: Add FS Records Adapter `_backlog/3-now/plan-add-fs-records-adapter/plan.md`                             | `DONE`     |
| 1     | Plan: Add FS Records Knowledge `_backlog/4-next/plan-add-fs-records-knowledge/plan.md`                        | `READY`    |
| 1     | Plan: Add Operations Package `_backlog/6-plan/plan-add-operations/plan.md`                                    | `PLANNING` |
| 1     | Plan: Add Logger Package `_backlog/6-plan/plan-add-logger/plan.md`                                            | `PLANNING` |
| 1     | Plan: Add Config Package `_backlog/6-plan/plan-add-config/plan.md`                                            | `PLANNING` |

---

## Work

### Next

- **Plan: Add FS Records Knowledge** is `READY` — delegate its three iterations (update README, verify guide, add knowledge directory). Then write instructions for **Plan: Add Logger Package**, then **Plan: Add Operations Package** (needs the logger `Message` interface). **Plan: Add Config Package** is independent — can run anytime, in parallel.

### Blockers

- None. The **`@art-js/records` hold on Plan: Add FS Records Adapter was lifted 2026-10-13** — `ART_JS` (producer) and `ART_WORK` (consumer) both confirmed the adapter imports nothing from `@art-js/records`; its only upstream dependency is `ArtContentSource` from the published `@art-md/primitives@0.0.3`. All three iterations are `READY` and their instruction files are current. Residual note, tracked in the plan's Follow Ups: the agreed symbol names (`discoverRecordFiles`, `FSRecordsPattern`, `FSRecordFile.basePath`) land with iteration 1 and are **not** in the published `0.0.1` — consumers verifying exports against `0.0.1` must expect the pre-rename names until then.

---

## Operating Instructions

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/ops/writing-commit-message.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following: the rules defined there.

---

## Coordination

### Not In Scope

- None.

### Evidence

- None.

### Findings

- None.

### Decisions

- Accept **`@art-lib/operations`** as a package with two pure subpath modules (`/model`, `/log`): operation model + factories, and operations log. Merges proposal packages 1 and 3 from the Art MD message (`_backlog/_message-from-art-md-project.md`, since deleted).
- Split the buffering logger out of operations into planned **`@art-lib/logger`** (merges proposal package 2): normalized logging of operations and messages with buffering, wrapping the actual log writer.
- Reject `cli-command-runner`, `cli-test-helpers`, and `cli-present` from the Art MD proposal (see Follow Ups for revisit triggers).

### Knowledge to Update

- None.

### Follow Ups

- Reconsider `cli-command-runner` when a third CLI exists — rejected as premature generalization over two data points (`...deps: unknown[]`, `getOutputMode(options, config)`).
- Dedup `makeTempDir`/`removeTempDirs` test helpers across `fs-records` and the CLIs as a later chore — not a lib package.

### Feedback

- None.
