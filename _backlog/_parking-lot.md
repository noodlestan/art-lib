# Parking Lot: Art Lib Backlog

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **pending** (waiting), **BLOCKER** (blocking work), **FOLLOW-UPS** (not in scope).

## Ongoing

- **Milestone: Art Lib One** — `$PROJECT/_roadmap/3-now/milestone-art-lib-one/milestone.md`; phase 1 `WORKING`.
- **Participate in the Art Records Whiteboard (owned by `ART_JS`)** — board at `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`; adapter plan `DONE`, knowledge plan `DONE`.
- **Package plans in `_backlog/3-now/`** — `Plan: Add Config` is `WORKING`: seven of eight iterations `DONE` and **`@art-lib/config@0.0.1` published to npm**, leaving only `Integrate in Consumer`, whose gate is now lifted. `Plan: Add Logger` is `WORKING` (scaffold done, policy-compliant manifest); `Plan: Add Operations` remains `READY` awaiting delegation. Logger must land before Operations.

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
