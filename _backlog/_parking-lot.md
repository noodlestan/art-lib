# Parking Lot: Art Lib Backlog

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **pending** (waiting), **BLOCKER** (blocking work), **FOLLOW-UPS** (not in scope).

## Ongoing

- **Milestone: Art Lib One** — `$PROJECT/_roadmap/3-now/milestone-art-lib-one/milestone.md`; phase 1 `WORKING`.
- **Participate in the Art Records Whiteboard (owned by `ART_JS`)** — board at `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`; adapter plan `DONE`, knowledge plan `DONE`.
- **Package plans** — `Plan: Add Config` and `Plan: Add Logger` are **closed and moved to `_backlog/1-done/`**: Config's eight iterations and Logger's six are all `DONE`, with `@art-lib/config@0.0.1` and `@art-lib/logger@0.0.1` published — Config adopted by `@art-works/workspace-cli@0.3.1`, Logger by the Art Works Workspace Cli (`bf2fc78`). `Plan: Add Operations` remains `READY` and is now fully unblocked: its scaffold, log, and publish gates are all satisfied.

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
