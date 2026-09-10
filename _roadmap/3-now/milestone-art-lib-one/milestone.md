# Milestone: Art Lib One

**ID:** `art-lib-one`

**Status:** `WORKING`

**Template:** `$DOMAINS/roadmaps/templates/milestone.tart`

**Skill:** `write-milestone`

**Purpose:** Provide composable units for Cli experiences.

**Description:** This milestone is driven by use cases surfaced in CLIs under development.

## Mandatory Reading

::READ `$DOMAINS/roadmaps/structures/milestone.art` (Structure) — Defines the milestone structure and nested types.

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
| Source      | `$PROJECT/_roadmap/_architect.md`   | Architect Briefing: Workspace CLI (Milestone 1)                 |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `write-milestone` — Writes milestones from roadmaps and backlogs. Required for Planning Work Item.

### Domains

| Domain / Path                                 | Description                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |
| Domain: Roadmaps `$DOMAINS/roadmaps/index.md` | Roadmaps and milestones coordination.                                              |

### Knowledge

::READ `_roadmap/_architect.md` (Briefing) — Workspace principles, NFRs, milestones. Relevant for Planning Work Item.

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
| 1     | Plan: Create Art Cli Project and Repo `_backlog/1-done/plan-create-art-cli-project-repo/plan.md`              | `DONE`     |
| 1     | Plan: Extract Read/Write Records to Art Cli `_backlog/1-done/plan-extract-read-write-records-art-lib/plan.md` | `DONE`     |
| 1     | Plan: Add FS Records Store `_backlog/4-next/add-fs-records-store/plan.md`                                     | `PLANNING` |

---

## Work

### Next

- None.

### Blockers

- None.

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

- None.

### Knowledge to Update

- None.

### Follow Ups

- None.

### Feedback

- None.
