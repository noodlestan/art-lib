# Parking Lot: Art Lib Backlog

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **pending** (waiting), **BLOCKER** (blocking work), **FOLLOW-UPS** (not in scope).

## Ongoing

- **Milestone: Art Lib One** — `$PROJECT/_roadmap/3-now/milestone-art-lib-one/milestone.md`; phase 1 `WORKING`.
- **Participate in the Art Records Whiteboard (owned by `ART_JS`)** — board at `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`; adapter plan `DONE`, knowledge plan `DONE`.
- **Package plans** — `Plan: Add Config` is **closed and in `_backlog/1-done/`**: eight iterations `DONE`, `@art-lib/config@0.0.1` published and adopted by `@art-works/workspace-cli@0.3.1`. `Plan: Add Logger` was closed and has been **reopened into `_backlog/3-now/`** for a third output mode — its six iterations are `DONE` with `@art-lib/logger@0.0.1` published and adopted (`bf2fc78`), and three new `READY` iterations cover the `normal` mode, the `0.0.2` release, and the CLI's single `-o` flag. `Plan: Add Operations` remains `READY` and is now fully unblocked: its scaffold, log, and publish gates are all satisfied.

---

## ACTIONABLE

- **`createRunner` entry point (Art Lib candidate)** — `createRunner(logger, options).run(handler => …)`: graceful interruption/crash handling plus `handler.shutdown()`/`handler.onShutdown()` hooks; watcher lifecycle stays with each CLI. Surfaced via `ART_LIB` on the Art Boards board. No plan drafted yet — needs `write-plan` or an explicit deferral.

## PENDING

None current.

## BLOCKERS

None current.

---

## Follow-ups

None current.
