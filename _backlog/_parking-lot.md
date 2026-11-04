# Parking Lot: Art Lib Backlog

WIP tracker, structured like the session parking lot: **ACTIONABLE** (in progress now), **pending** (waiting), **BLOCKER** (blocking work), **FOLLOW-UPS** (not in scope).

## Ongoing

- **Milestone: Art Lib One** — `$PROJECT/_roadmap/3-now/milestone-art-lib-one/milestone.md`; phase 1 `WORKING`.
- **Participate in the Art Records Whiteboard (owned by `ART_JS`)** — board at `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md`; adapter plan `DONE`, knowledge plan `DONE`.
- **Package plans** — `Plan: Add Config` is **closed and in `_backlog/1-done/`**: eight iterations `DONE`, `@art-lib/config@0.0.1` published and adopted by `@art-works/workspace-cli@0.3.1`. `Plan: Add Logger` was closed and has been **reopened into `_backlog/3-now/`** for a third output mode — its six iterations are `DONE` with `@art-lib/logger@0.0.1` published and adopted (`bf2fc78`), and three new `READY` iterations cover the `normal` mode, the `0.0.2` release, and the CLI's single `-o` flag. `Plan: Add Operations` remains `READY` and is now fully unblocked: its scaffold, log, and publish gates are all satisfied.

---

## ACTIONABLE

- **`createRunner` entry point (Art Lib candidate)** — `createRunner(logger, options).run(handler => …)`: graceful interruption/crash handling plus `handler.shutdown()`/`handler.onShutdown()` hooks; watcher lifecycle stays with each CLI. Surfaced via `ART_LIB` on the Art Boards board. No plan drafted yet — needs `write-plan` or an explicit deferral.
- **`compileConfig` does not silence esbuild output** — `src/compile/compileConfig.ts` calls esbuild `build()` without `logLevel`, so esbuild writes the formatted `✘ [ERROR] …` diagnostic straight to stdout/stderr (service child uses `stdio: 'inherit'`; no console/stderr spy can intercept it) before `compileConfig` throws. Fix: pass `logLevel: 'silent'` in `buildOptions` — esbuild still throws with full details in `error.message`, so callers' wrapped errors are unaffected. Add a test asserting the console/stderr shows **no output in either case**: esbuild fails _and_ esbuild succeeds. Snippet that makes the config compile fail: `export default {{{` — write it to a temp `.art-workspace.mts` and expect `compileConfig` to reject. Surfaced from `Plan: Fix Pull Checkout Test` (`$ART_WORKS/_backlog/4-next/plan-fix-pull-checkout-test/plan.md`), whose suite run emits exactly this noise. No plan drafted yet — needs `write-plan`.

## PENDING

None current.

## BLOCKERS

None current.

---

## Follow-ups

None current.
