# Plan: Add Logger Package

**ID:** `add-logger`

**Status:** `DONE`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Provide a normalized way to log messages — operations conform to the message interface — with buffering, wrapping the actual log writer.

**Description:** Create the `@art-lib/logger` package: a `Message` interface with severity levels and message creators (`createMessage`, `createInfoMessage`, `createWarningMessage`, `createErrorMessage`, `createDebugMessage`), and a buffering logger with output modes that formats messages through an injected formatter and writes through an injectable log writer. The logger knows only messages — never operations. Split out of the operations package per the milestone decision.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable     | Resolved Path                | Purpose                         |
| ------------ | ---------------------------- | ------------------------------- |
| `$WORKSPACE` | Current working directory    | Workspace root directory        |
| `$DOMAINS`   | `$WORKSPACE/.agents/domains` | Domain resources directory      |
| `$PROJECT`   | Provided with prompt         | Art Lib repository (this plan). |

## Summary

Create `@art-lib/logger` with the `Message` interface and message creators, plus a buffering `createLogger()` — `quiet`/`verbose` output modes, injected `LogFormatter`, injectable log writer. The logger has no dependency on `@art-lib/operations`; operations conform to `Message` structurally.

## Context

### Upstream Work

| Kind        | Path                                                         | Role                                                            |
| ----------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| Parking Lot | `$PROJECT/_backlog/_parking-lot.md`                          | Tracks short-term actionables, pending questions, and blockers. |
| Milestone   | `$PROJECT/_roadmap/3-now/milestone-art-lib-one/milestone.md` | Scope and the recorded logger-split decision.                   |

### Required Skills

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

| Domain / Path                           | Description                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md` | Planning lifecycle for contextualising, drafting, planning, and integrating plans. |

### Knowledge

::READ `$PROJECT/libs/logger/knowledge/design/logger.md` (Design) — Published surface: message model, buffering contract, output modes. Relevant for Planning Work Item.

::READ `$PROJECT/knowledge/index.md` (Model) — Package layout and publishing conventions. Relevant for Planning Work Item.

## Scope

Create `$PROJECT/libs/logger` exposing the message model (`Message`, creators) and the buffering logger — `LoggerAPI`, `LogFormatter`, injectable writer, `quiet`/`verbose` modes — with tests, package records, and docs mirroring `libs/fs-records` conventions. Operation model and log stay in `@art-lib/operations`; adoption refactors in consumers are out of scope.

## Work

### Next

- **Reopened 2026-11-03.** The package shipped `0.0.1` with a two-mode `OutputMode` (`quiet` | `verbose`) and the CLI adopted it, but the mode model needs a middle tier: `normal` emits `info`/`warning`/`error`, `verbose` adds `debug`, `quiet` keeps only `warning`/`error`. That makes `normal` the CLI's default and lets `@art-lib/operations`' level mapping (`pending → debug`, `success → info`, `failure → error`) work as designed — `normal` shows finished successes, `quiet` shows only problems.
- All iterations are `DONE` — plan complete (`update-cli-output-flag` landed in Art Works as `4a100fb`: single program-level `-o` defaulting to `normal`, `createCommandContext` extracted to `private/context`, mode typed as `OutputMode`, `@art-lib/logger@0.0.2` re-installed). Architect closes the plan and refreshes the milestone.
- **Done 2026-11-06: Iteration: Publish Logger 0.0.2** (`296e359`) — `@art-lib/logger@0.0.2` is live on the registry (`dist-tags.latest` → `0.0.2`); the `normal` output mode is now consumable.
- **Out of scope here:** the `Operation → Message` adapter (`createMessageFromOperation`, and where `levelOf` lives) belongs to `@art-lib/operations` and is tracked on `Plan: Add Operations Package`. This plan must not move that glue.

### Blockers

- None.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install dependencies.
npm run ci # to verify build is green before starting
```

If any of these fail, resolve the issue before proceeding with implementation. Do NOT run `npm install` inside `$PROJECT` (the package directory) — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/writing-commit-message/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.

2. Write the commit message following: the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run build
npm run test
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Items:

| Iteration / Instructions                | Status |
| --------------------------------------- | ------ |
| Iteration: Scaffold Logger Package      | `DONE` |
| Iteration: Implement Buffering Logger   | `DONE` |
| Iteration: Apply Noodlestan Conventions | `DONE` |
| Iteration: Update Knowledge             | `DONE` |
| Iteration: Publish Logger Package       | `DONE` |
| Iteration: Integrate in Consumer        | `DONE` |
| Iteration: Add Normal Output Mode       | `DONE` |
| Iteration: Publish Logger 0.0.2         | `DONE` |
| Iteration: Update Cli Output Flag       | `DONE` |

> The first six iterations delivered and shipped `@art-lib/logger@0.0.1`, and the plan was closed — then reopened 2026-11-03 for a third output mode. The reopening scope was three iterations; `Add Normal Output Mode` is now `DONE`, leaving **two** `READY` rows: `Publish Logger 0.0.2` and `Update Cli Output Flag`.

### Iteration: Scaffold Logger Package

**Id:** `scaffold-logger-package`

**Status:** `DONE`

**Purpose:** Create the `logger` package skeleton before adding the module.

**Description:** Scaffold `$PROJECT/libs/logger` as a fully-formed, policy-compliant package: build files, a manifest derived from the package record under `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md`, the metadata files, and both records. The logger knows only messages, so it declares no internal dependencies.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$PROJECT/libs/logger`

**1 — Build and tooling files.**

- `tsconfig.json` and `vitest.config.ts` extending the monorepo configs, plus `tsconfig.build.json` for declaration emit (`dist/index.d.ts`).
- `build.config.mjs` — the `esbuild-cli` build config: bundle `src/index.ts` → `dist/index.mjs` with declarations, `external: ['esbuild']`. **Required**: `npm run build` exits without it; `esbuild-cli` reads it next to `package.json`.
- `.prettierignore` — `.coverage/`, `coverage/`, `env.d.ts`, `dist/`. Without it a bare `npm run lint` fails on `dist/` once the package has been built.
- `.npmignore` — `*.test.ts`, `*.test.tsx`.
- `src/index.ts` — placeholder entry point.

**2 — `_records/package.art` first: it is the source of truth.**

Mirror the shape of `libs/fs-records/_records/package.art`: Purpose, Description, Owner, Namespace, Author, Path, Canonical Name, Published `false`, Private `false`, Keywords, Language, Engines, PackageManager, PackageFile, License, Files. Write this before the manifest — the manifest is a _rendering_ of it.

**3 — `package.json`: derive every field, never assemble one from parts.**

Read `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md` first. It is authoritative for which fields are required, what value each takes, and the exact key order.

- `name` `@art-lib/logger`; `version` `0.0.1`; `private` `false`; `type` `module`; `sideEffects` `false`; `exports` root only (`./src/index.ts`); no internal dependencies.
- `description` — copied from the `**Description:**` field of `_records/package.art`, verbatim. `author`, `engines`, and `files` likewise derive from the record.
- `license` `MIT`; `engines.node` `>=22`; `publishConfig` `{ "access": "public" }`; `repository` with the https endpoint and `directory` set repo-relative to `libs/logger`. Both `repository` and `publishConfig` are mandatory for a public package.
- `files` — `dist`, `README.md`, `LICENSE-MIT`, `CHANGELOG.md`. Policy requires the last three on every public package; `README.md` is listed here even though `Iteration: Update Knowledge` creates it later.
- `keywords` — per `$WORKSPACE/checkouts/management/_ops/keywords/matrix.md`: this package's **own** keywords first, then the Art Lib project keywords `art, terminal-apps`, deduplicated, first occurrence wins. Never copy another package's keyword set.
- Scripts mirroring `libs/fs-records`.
- Key order must match the **Field Ordering** section of the policy exactly.

**4 — Artefact relationships: one description, one keyword set, one canonical name, across every carrier.**

- `_records/package.art` is the **source of truth**. Its description feeds `package.json` `description` and the README tagline; its keywords feed `package.json` `keywords` (composed with the project's per the matrix); its Author, Canonical Name, Path, Engines, and Files feed the matching manifest fields.
- `_records/npm-deployment.art` is the **deployment record for the same canonical name** — `PLANNED` until the first publish, then `DEPLOYED`. Mirror `libs/fs-records/_records/npm-deployment.art`, set `Status` `PLANNED`, Canonical Name `@art-lib/logger`, Registry and Access as in the reference. It does not restate the description.
- `README.md` (created later) opens with the canonical name as its H1 and the package description as its tagline, so a reader on npm sees the same sentence the record declares.
- `_guide.md` (this iteration) describes the package and its operating instructions for agents, references the `knowledge/` directory that `Iteration: Update Knowledge` creates, and must not contradict the README.
- The canonical name must appear identically in `package.json` `name`, both records' Canonical Name, the README H1, and the `_guide.md` prose. The manifest is a rendering of the records — never an independent source.

**5 — `LICENSE-MIT` and `CHANGELOG.md`.**

- `LICENSE-MIT` — copy verbatim from `libs/fs-records/LICENSE-MIT`.
- `CHANGELOG.md` — `# CHANGELOG`, `## 0.0.1`, `### Added`.

**6 — Add this package to the keywords matrix.**

`$WORKSPACE/checkouts/management/_ops/keywords/matrix.md` has no row for `@art-lib/logger`. Add one under `## Art Lib` listing the package's **own** keywords only — the matrix stores own keywords, and the composed set is derived from them.

**7 — Out of scope for this iteration.**

Do **NOT** create `README.md` or `knowledge/` — `Iteration: Update Knowledge` owns both.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.
- Read `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md` and `$WORKSPACE/checkouts/management/_ops/keywords/matrix.md` in full — the manifest and keywords must conform to them, not to your prior assumptions.
- Read `$PROJECT/libs/logger/knowledge/design/logger.md` and `$PROJECT/_guide.md` for what this package must provide.

Validate that:

- **Manifest conforms to policy:** every field the policy requires is present, including `repository` (https endpoint, repo-relative `directory`) and `publishConfig` `{ "access": "public" }`, and the key order matches the policy's **Field Ordering** section.
- **Records and manifest agree:** `description`, `author`, `engines`, and `files` are byte-identical to what `_records/package.art` declares; the canonical name is identical across `package.json`, both records, and `_guide.md`.
- **Keywords follow the matrix model:** own keywords + `art, terminal-apps`, deduplicated; the matrix now carries this package's row.
- `npm run build` passes (`build.config.mjs` present) and `npm run lint` passes on the built tree (`.prettierignore` present).
- `npm pack --dry-run` from `$PROJECT/libs/logger` lists `LICENSE-MIT` and `CHANGELOG.md`.
- No `node_modules` directory exists inside `$PROJECT/libs/logger`.
- No `README.md` and no `knowledge/` were created.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/logger/`.
- Commit `scaffold-logger` with the blueprint message below.

**Dependencies:**

- None.

#### Commits:

| ID                | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ----------------- | ------------------------------ | ------------ | --------- | ----------- |
| `scaffold-logger` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `ac059a8` | `COMMITTED` |

##### Commit: `scaffold-logger`

**Message:**

```text
scaffold(logger): Scaffold package skeleton.

- Create manifest, tsconfig, vitest config, and scripts mirroring `libs/fs-records`.
- Add `_guide.md` and `_records/package.art`.
```

### Iteration: Implement Buffering Logger

**Id:** `implement-buffering-logger`

**Status:** `DONE`

**Purpose:** Implement the message model and the buffering logger with output modes, injected formatter, and injectable writer.

**Description:** Implement `src/` with the message model — `Message { level, text(), ts }`, `createMessage(options)`, `createDebugMessage`, `createInfoMessage`, `createWarningMessage`, `createErrorMessage(error: MaybeError, message?)` — and the logger — `LoggerAPI { log(message), setOutputMode(mode) }`, `LogFormatter { format(message): string[] }`, `LogWriter { write(lines): void }`, `createLogger(options?: { formatter?, writer? })`. Buffer messages until the mode is set: `quiet` discards the buffer and then logs only `warning`/`error`; `verbose` flushes and logs everything. **Superseded for `quiet`** — that is what shipped in `0.0.1`, and `Iteration: Add Normal Output Mode` corrects it to flush-and-filter, because discarding hid the pre-mode warnings `quiet` exists to surface. Default writer wraps `console.error`; formatting delegates to the injected formatter. The logger never imports operations — they conform to `Message` structurally. Unit tests.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./plan-add-logger/instructions/implement-buffering-logger.md`

**Report:** `./plan-add-logger/instructions/implement-buffering-logger__report.md`

**Delegation:** `COMPLETED` — worker session `ses_e665a175bffeDPtatbSqXuup5o`.

**Changes:**

In `$PROJECT/libs/logger/src/`

- `message/types.ts` — `Message`, `MessageLevel`, `MaybeError`.
- `message/createMessage.ts` — `createMessage`, `createDebugMessage`, `createInfoMessage`, `createWarningMessage`, `createErrorMessage`.
- `types.ts` — `LoggerAPI`, `LogFormatter`, `LogWriter`.
- `createLogger.ts` — `createLogger(options?)`; buffer semantics for `quiet`/`verbose`; default writer via `console.error`; default formatter producing the glyph | name | text | timing cells.
- `message/createMessage.test.ts` and `createLogger.test.ts` — creators per level, buffering, mode transitions, writer delegation, formatter injection.
- Update `src/index.ts` exports.

**Dependencies:**

- Iteration: Scaffold Logger Package.

#### Commits:

| ID                     | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ---------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `add-buffering-logger` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `b9c7dbb` | `COMMITTED` |

##### Commit: `add-buffering-logger`

**Message:**

```text
build(logger): Add message model and buffering logger.

- Add `Message` creators, `LoggerAPI`, injected formatter, and injectable writer.
- Buffer messages until the output mode is set; cover `quiet`/`verbose` with tests.
```

**Hash:** `b9c7dbb` — pushed to `origin/main`.

**Status:** `COMMITTED`

### Iteration: Apply Noodlestan Conventions

**Id:** `apply-noodlestan-conventions`

**Status:** `DONE`

**Purpose:** Align `libs/logger` with the Noodlestan conventions adopted in this workspace.

**Description:** Audit the package against the conventions declared in `$PROJECT/_guide.md` (TypeScript, unit tests) using the `manage-conventions` skill, install what is missing, and resolve the findings — without changing the package behaviour. Commit as `style(logger): Apply Noodlestan conventions.`

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$PROJECT/libs/logger`

- Discover, install, and audit the conventions applicable to the package with the `manage-conventions` skill.
- Resolve findings: package scripts, tsconfig, lint/test wiring, and convention-mandated files.
- Declare newly installed conventions in `$PROJECT/_guide.md` under `## Conventions`.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above, keeping the package behaviour identical.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.

Validate that:

- Every convention that applies to the package is installed and its findings are resolved.
- `npm run ci` passes from the `$WORKSPACE` root.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/logger/`.
- The commit `apply-conventions-logger` has policy `MANUAL` — stage the changes, report back with the proposed commit message; do not commit.

**Dependencies:**

- Iteration: Implement Buffering Logger.

#### Commits:

| ID                         | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| -------------------------- | ------------------------------ | -------- | --------- | ----------- |
| `apply-conventions-logger` | Art Lib / `$PROJECT` / `main`  | `MANUAL` | `4408461` | `COMMITTED` |

##### Commit: `apply-conventions-logger`

**Message:**

```text
refactor(logger): Apply Noodlestan conventions.

- Adopt the conventions that apply to the package and resolve audit findings.
```

**Hash:** `4408461` — pushed to `origin/main`.

**Status:** `COMMITTED`

### Iteration: Update Knowledge

**Id:** `update-knowledge`

**Status:** `DONE`

**Delegation:** `COMPLETED` — worker session `ses_e629b7a5bffeBqbeu3P4EWRgF0`.

**Purpose:** Publish the package knowledge base and wire `@art-lib/logger` into the repository artefacts.

**Description:** Add a consumer-facing README and a package knowledge base, then update the repository knowledge, project record, and guide to list the package and link its knowledge. Commit as `docs(logger): Add package knowledge base and README usage.`

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

- `$PROJECT/libs/logger/README.md` — consumer-facing `## Usage` following the pattern of `$WORKSPACE/checkouts/workspace-tooling/cli/esbuild-cli/README.md`: what it is, install, configure, example, options.
- `$PROJECT/libs/logger/knowledge/` — package knowledge base following `$WORKSPACE/checkouts/art-md/cli/bin/knowledge`: at least `index.md`, `overview.md`, and `design/logger.md`; add `adr/` records where decisions exist.
- `$PROJECT/libs/logger/_guide.md` — reference the local knowledge base (`knowledge/index.md`).
- `$PROJECT/knowledge/components.md` — move the Logger entry to `IMPLEMENTED` and link its package knowledge.
- `$PROJECT/knowledge/index.md` — add a Package Knowledge References row linking `libs/logger/knowledge/index.md` (see `$WORKSPACE/checkouts/art-md/knowledge/index.md`).
- `$PROJECT/_records/project.art` — add `- Package: Art Lib Logger` to Resources.
- `$PROJECT/_guide.md` — list the package under the repository layout and its knowledge base under Knowledge References.
- ~~Keep `$PROJECT/knowledge/design/logger.md` as the repository-level design record.~~ — **superseded 2026-11-05** by `8cc4620`: the repository-level record was retired and its content consolidated into `$PROJECT/libs/logger/knowledge/`. The package design record is now the single source.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.

Validate that:

- The package knowledge links resolve and the README `## Usage` is self-sufficient for a new consumer.
- Every repository reference lists the package: `knowledge/index.md`, `knowledge/components.md`, `_records/project.art`, `_guide.md`.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/logger/`.
- Commit `update-knowledge-logger` with the blueprint message below.

**Dependencies:**

- Iteration: Apply Noodlestan Conventions.

#### Commits:

| ID                        | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ------------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `update-knowledge-logger` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `7767871` | `COMMITTED` |

##### Commit: `update-knowledge-logger`

**Message:**

```text
docs(logger): Add package knowledge base and README usage.

- Add the package knowledge base, a consumer-facing README, and repository references.
- Link the package knowledge from the repository knowledge index.
```

**Hash:** `7767871` — pushed to `origin/main`.

**Status:** `COMMITTED`

### Iteration: Publish Logger Package

**Id:** `publish-logger-package`

**Status:** `DONE`

**Delegation:** `COMPLETED` — worker session `ses_e5dc4c9eeffezpns1mmvniJV6q`.

**Purpose:** Publish `@art-lib/logger@0.0.1` to the public registry and record the deployment, lifting `Integrate in Consumer`'s gate.

**Description:** Publish the first version and flip both records to their deployed state. No version bump and no CHANGELOG edit are needed — this is the first publish, `version` is already `0.0.1`, and `CHANGELOG.md` already documents `## 0.0.1`. The release commit therefore carries only the record updates, the same shape as `release(fs-records): 0.0.3`, which carried the state change rather than code. Added after `Iteration: Update Knowledge`, mirroring `Plan: Add Config Package`'s `publish-config-package`, so `Integrate in Consumer` has a gate it can actually lift.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

1. Verify every publish precondition **before** touching the registry. Any failure is a `REPORT A BLOCKER`, not something to work around:
   - `npm whoami` returns an account permitted to publish `@art-lib/*` (currently `noodlestan`).
   - `npm view @art-lib/logger version` fails with `ENOTFOUND` — `0.0.1` must not already exist. A published version is immutable, so a mistake requires a bump and a new publish.
   - `$PROJECT/libs/logger/package.json` carries `version` `0.0.1`, `private` `false`, `publishConfig` `{ "access": "public" }`, and `files` listing `dist`, `README.md`, `LICENSE-MIT`, `CHANGELOG.md`.
   - All four `files` entries exist on disk, and the manifest conforms to `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md`.
2. `npm pack --dry-run` from `$PROJECT/libs/logger`, and confirm the tarball contains `package.json`, `dist/index.mjs`, `dist/index.d.ts`, `README.md`, `LICENSE-MIT`, and `CHANGELOG.md`.
3. `npm publish --access public` from `$PROJECT/libs/logger`. If the registry demands a one-time password for two-factor authentication, **do not retry and do not unpublish** — `REPORT A BLOCKER` that publishing requires an OTP and stop.
4. Confirm the publish landed: `npm view @art-lib/logger version` returns `0.0.1`, and the description, keywords, and `engines` match `_records/package.art`.
5. Update both records to the deployed state:
   - `$PROJECT/libs/logger/_records/package.art` — `**Published:**` from `false` to `true`.
   - `$PROJECT/libs/logger/_records/npm-deployment.art` — `**Status:**` from `PLANNED` to `DEPLOYED`.
6. Do not change `version` or `CHANGELOG.md`.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above.

**This iteration publishes a public and immutable artefact.** Treat the step-1 preconditions as hard stops: if any fails, `REPORT A BLOCKER` and do not attempt a workaround. Never unpublish.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.
- Read `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md` — the manifest must already conform before it ships.

Validate that:

- The registry serves `@art-lib/logger@0.0.1` with the expected `description`, `keywords`, and `engines`.
- Both records reflect the deployed state: `_records/package.art` `Published` `true`, `_records/npm-deployment.art` `Status` `DEPLOYED`.
- `version` and `CHANGELOG.md` are untouched.
- `npm run ci` still passes from the `$WORKSPACE` root.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/logger/`.
- Commit `publish-logger` with the blueprint message below.

**Dependencies:**

- Iteration: Update Knowledge — the published package must ship the README its registry listing and consumers reference.

#### Commits:

| ID               | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ---------------- | ------------------------------ | ------------ | --------- | ----------- |
| `publish-logger` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `1091288` | `COMMITTED` |

##### Commit: `publish-logger`

**Message:**

```text
release(logger): Publish 0.0.1 to npm.

- Record the first publish: `Published` true, deployment `DEPLOYED`.
```

**Hash:** `1091288` — pushed to `origin/main`. Carries only the two record updates: the registry action itself has no file to record beyond them.

**Status:** `COMMITTED`

### Iteration: Integrate in Consumer

**Id:** `integrate-in-consumer`

**Status:** `DONE`

**Delegation:** `COMPLETED` — worker session `ses_e5db56041ffeFSoI7Egzf3q2WU`.

**Purpose:** Adopt `@art-lib/logger` in the Art Workspace Cli and retire its duplicated implementation.

**Description:** Refactor `$WORKSPACE/checkouts/art-works/cli/workspace` to consume `@art-lib/logger`, keeping CLI-specific conventions on the CLI side. Commit in the Art Works repository as `refactor(workspace-cli): Adopt @art-lib/logger in the Workspace Cli.`

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$WORKSPACE/checkouts/art-works` (Art Works repository)

- `cli/workspace/package.json` — declare `@art-lib/logger` the way `@art-lib/fs-records` is declared.
- `cli/workspace/src/private/logger/createLogger.ts` — replace with `createLogger` from `@art-lib/logger`; inject the CLI's log-line formatter where it differs from the package default.
- `cli/workspace/src/private/present/makeOperationLogLine.ts` — keep as the formatter passed to `createLogger`, or retire it when the package default covers the CLI's log line.
- Update callers and test helpers; keep the logged output identical.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

**GATE — do not start until the package is consumable:** `Iteration: Publish Logger Package` must be `DONE` and `@art-lib/logger@0.0.1` must be installable from the Art Works checkout; verify it exposes the documented API before proceeding. The preceding iterations are a prerequisite only insofar as they produced what was published. This consumer-integration iteration is deliberately excluded from the gate. If the package is not yet available or the API is missing, REPORT A BLOCKER with "logger package not published/consumable yet" and STOP.

Execute the Changes listed above, keeping the CLI behaviour identical.

Before starting:

- Run `npm ci` from `$WORKSPACE/checkouts/art-works`.

Validate that:

- `npm run ci` passes from `$WORKSPACE/checkouts/art-works/cli/workspace`.
- The CLI behaviour is unchanged: the same inputs produce the same outputs.

After executing:

- Commit `integrate-logger-in-consumer` in the Art Works repository with the blueprint message below.

**Dependencies:**

- Iteration: Publish Logger Package.

#### Commits:

| ID                             | Repository / Checkout / Branch                        | Policy       | Hash      | Status      |
| ------------------------------ | ----------------------------------------------------- | ------------ | --------- | ----------- |
| `integrate-logger-in-consumer` | Art Works / `$WORKSPACE/checkouts/art-works` / `main` | `AUTONOMOUS` | `bf2fc78` | `COMMITTED` |

##### Commit: `integrate-logger-in-consumer`

**Message:**

```text
refactor(workspace-cli): Adopt @art-lib/logger in the Workspace Cli.

- Replace the local local buffering logger with @art-lib/logger.
- Keep CLI behaviour and its test suite green.
```

**Hash:** `bf2fc78` — pushed to `origin/main` **in the Art Works repository** (`$WORKSPACE/checkouts/art-works`).

**Status:** `COMMITTED`

### Iteration: Add Normal Output Mode

**Id:** `add-normal-output-mode`

**Status:** `DONE`

**Delegation:** `COMPLETED` — worker session `ses_e5bde482effeJQDI8d9VvR8OXa` (inlined instructions; no instruction file).

**Purpose:** Add a third output mode, `normal`, so severity filtering has a middle tier between "problems only" and "everything".

**Description:** Extend `OutputMode` to `'quiet' | 'normal' | 'verbose'` and give each mode its own emission rule: `verbose` emits everything, `normal` emits `info`/`warning`/`error` (dropping `debug`), `quiet` emits `warning`/`error` only. Buffer-until-mode-set semantics are unchanged. This is not in the published `0.0.1`, so it ships as `0.0.2` in the next iteration.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$PROJECT/libs/logger`

- `src/types.ts` — `OutputMode` becomes `'quiet' | 'normal' | 'verbose'`.
- `src/createLogger.ts` — replace the two-way `shouldEmit` with three tiers:
  - `verbose` → every message;
  - `normal` → `message.level !== 'debug'` (so `info`, `warning`, `error`);
  - `quiet` → `message.level === 'warning' || message.level === 'error'`.
- `setOutputMode` buffer resolution:
  - `quiet` — flush the buffer in order, emitting only `warning`/`error` and dropping `info`/`debug`. **Every mode flushes; none discards.**
  - `normal` — **flush the buffer in order, dropping `debug`**, then emit `info`/`warning`/`error`.
  - `verbose` — flush the buffer in order, then emit everything.
- `src/createLogger.test.ts` — assert per mode: which buffered messages survive the flush, and which levels pass once the mode is set. `normal` must keep a buffered `info` and drop a buffered `debug`; `quiet` must keep a buffered `warning` and drop a buffered `info` — that second assertion is the regression this change exists to fix, and it fails against the code as it stands today.
- Update every place the mode spec appears so all six describe three modes: `README.md` (tagline, examples, mode table), `_guide.md` (overview line and the `src/` tree), `knowledge/design/logger.md`, `knowledge/overview.md`, `knowledge/adr/logger.md`, and the repository-level `knowledge/design/logger.md`. Each currently reads `quiet` | `verbose`.
- Do **not** edit `instructions/implement-buffering-logger.md`. That instruction was executed for `0.0.1` and is the record of what shipped; this iteration is the record of what changes.
- Update `libs/logger/knowledge/adr/logger.md`: amend the _Buffer Until the Output Mode Is Set_ decision for the three rules, and add a _Three Output Modes_ decision recording why `normal` exists and that level derivation stays with `@art-lib/operations`.

**Level mapping is not this package's concern.** `@art-lib/operations` owns it — `pending → debug`, `success → info`, `failure → error`. Do not derive levels here; this iteration only decides which levels each mode admits.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.
- Read `$PROJECT/libs/logger/knowledge/design/logger.md` and `$PROJECT/libs/logger/knowledge/adr/logger.md` — the ADR's _Buffer Until the Output Mode Is Set_ decision must be updated alongside the code, not after it.

Validate that:

- `OutputMode` is exactly `'quiet' | 'normal' | 'verbose'` and nothing else in the package hard-codes a two-way mode check.
- Buffer behaviour matches the three rules above: every mode flushes the buffer and filters it, nothing discards it. Assert a buffered `warning` survives `quiet`, and a buffered `debug` does not.
- No `@art-lib/operations` import is introduced — the package stays messages-only.
- `npm run ci` passes from the `$WORKSPACE` root, and from `$PROJECT/libs/logger`: `lint:fix`, `lint`, `build`, `test` all pass with no `it.todo()`.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/logger/`.
- Commit `add-normal-output-mode` with the blueprint message below.

```text
build(logger): Add normal output mode.

- Three-tier emission: verbose all, normal info and above, quiet warning and error.
```

**Dependencies:**

- Iteration: Integrate in Consumer — the CLI already adopts `0.0.1`, so this is an increment to shipped behaviour rather than a first delivery.

#### Commits:

| ID                       | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ------------------------ | ------------------------------ | ------------ | --------- | ----------- |
| `add-normal-output-mode` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `ef5858e` | `COMMITTED` |

##### Commit: `add-normal-output-mode`

**Message:**

```text
build(logger): Add normal output mode.

- Three-tier emission: verbose all, normal info and above, quiet warning and error.
```

**Hash:** `ef5858e` — pushed to `origin/main`. Rebased over remote `2e520eb`; the push also carried the two already-local commits `dc03a01` (`docs(logger): Describe the normal output mode…`) and `e82909b` (`plan(add-logger): Reopen for the third output mode…`).

**Status:** `COMMITTED`

### Iteration: Publish Logger 0.0.2

**Id:** `publish-logger-0-0-2`

**Status:** `DONE`

**Delegation:** `COMPLETED` — worker session `ses_e516efb5fffeKuRakMGjqCYdlq` (inlined instructions; no instruction file).

**Purpose:** Ship the third output mode as `@art-lib/logger@0.0.2`.

**Description:** Bump the version, record the addition, publish, and verify. The mode is not in `0.0.1`, so the CLI cannot adopt `normal` until this lands. This is a subsequent release of an already-published package: `_records/package.art` already reads `Published: true` and `_records/npm-deployment.art` already reads `DEPLOYED`, and neither changes on a version bump.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

1. Verify every precondition **before** touching the registry. Any failure is a `REPORT A BLOCKER`, not a workaround:
   - `npm whoami` returns an account permitted to publish `@art-lib/*`.
   - `npm view @art-lib/logger version` returns `0.0.1` — `0.0.2` must not already exist. Published versions are immutable.
   - `$PACKAGE/package.json` has `private` `false`, `publishConfig` `{ "access": "public" }`, and `files` listing `dist`, `README.md`, `LICENSE-MIT`, `CHANGELOG.md`.
2. Set `version` to `0.0.2` and add a `## 0.0.2` section to `$PACKAGE/CHANGELOG.md` under `### Added` describing the `normal` output mode and its emission rule. Refresh `$PROJECT/package-lock.json`.
3. `npm pack --dry-run` from `$PACKAGE`; confirm the tarball lists `dist/index.mjs`, `dist/index.d.ts`, `README.md`, `LICENSE-MIT`, `CHANGELOG.md`.
4. `npm publish --access public` from `$PACKAGE`. If the registry demands a one-time password, `REPORT A BLOCKER` that publishing requires an OTP and stop — never retry, never unpublish.
5. Confirm `npm view @art-lib/logger version` returns `0.0.2`.
6. Leave `_records/package.art` and `_records/npm-deployment.art` unchanged; confirm they still read `Published: true` and `DEPLOYED`.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above.

**This publishes a public and immutable artefact.** Treat step 1 as a hard stop; if any precondition fails, `REPORT A BLOCKER` and do not work around it.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root.
- Read `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md` — the manifest must conform before it ships.

Validate that:

- The registry serves `@art-lib/logger@0.0.2`.
- `CHANGELOG.md` documents `0.0.2` and `README.md` matches the new three-mode behaviour.
- Both records still read the deployed state; `Published` and `Status` are unchanged.
- `npm run ci` passes from the `$WORKSPACE` root.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$PROJECT/libs/logger/`.
- Commit `publish-logger-0-0-2` with the blueprint message below.

```text
release(logger): 0.0.2

- Ship the `normal` output mode.
```

**Dependencies:**

- Iteration: Add Normal Output Mode — there must be something to publish.

#### Commits:

| ID                     | Repository / Checkout / Branch | Policy       | Hash      | Status      |
| ---------------------- | ------------------------------ | ------------ | --------- | ----------- |
| `publish-logger-0-0-2` | Art Lib / `$PROJECT` / `main`  | `AUTONOMOUS` | `296e359` | `COMMITTED` |

##### Commit: `publish-logger-0-0-2`

**Message:**

```text
release(logger): 0.0.2

- Ship the `normal` output mode.
```

**Hash:** `296e359` — pushed to `origin/main`. Carries `libs/logger/package.json` (`version` `0.0.2`), a `## 0.0.2` `### Added` CHANGELOG section, and the refreshed `package-lock.json`.

**Status:** `COMMITTED`

### Iteration: Update Cli Output Flag

**Id:** `update-cli-output-flag`

**Status:** `DONE`

**Purpose:** Adopt the three output modes in the Art Workspace Cli with a single global `-o` flag that defaults to `normal`.

**Description:** When the Art Workspace Cli re-installs `@art-lib/logger@0.0.2`, collapse its eleven per-command `-o, --output` declarations into one program-level option, default to `normal`, type the CLI's output as `OutputMode` instead of `string` wherever the type is reachable, and move `createCommandContext` out of `index.ts` into `private/context/`.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Changes:**

In `$WORKSPACE/checkouts/art-works/cli/workspace`

1. **Re-install the dependency.** Bump `@art-lib/logger` to `0.0.2` in `package.json` and refresh the lockfile. `npm install` from the `$ART_WORKS` root — never inside `cli/workspace`.
2. **`src/index.ts` — one flag, not eleven.**
   - Remove every `.option('-o, --output <mode>', 'One of quiet|verbose')` from the eleven commands (`sanity`, `clone`, `branch`, `pull`, `push`, `sync`, `checkouts:run`, `repo`, `link`, `unlink`, `publish`).
   - Add one program-level `program.option('-o, --output <mode>', 'One of quiet | normal(default) | verbose')` beside `--no-config-cache`.
   - Drop `output?: string` from every `*Options` type (`SanityOptions`, `CloneOptions`, `BranchOptions`, `PullOptions`, `PushOptions`, `SyncOptions`, `CheckoutsRunOptions`, `RepoOptions`, `LinkOptions`, `UnlinkOptions`, `PublishOptions`).
   - Read the flag once with `command.optsWithGlobals().output` instead of `options.output`.
   - Delete the local `createCommandContext` function and import it from `private/context/createCommandContext.js`.
3. **`src/private/context/createCommandContext.ts` (new)** — the extracted function. Its third parameter becomes `mode?: OutputMode` rather than `output?: string`, and the default is `logger.setOutputMode(mode ?? 'normal')`. Keep the existing `logger.log(createGenericOperation('boot'))` call and the `createConfig(..., { verbose: mode === 'verbose' })` wiring as they are.
4. **`src/private/logger/createLogger.ts`** — type `LoggerAPI.setOutputMode` as `OutputMode`, not `string | undefined`. Keep exactly one `parseOutputMode(value?: string): OutputMode` at the commander boundary so the string from argv is converted once and the rest of the CLI never sees a raw string.
5. Do **not** move `levelOf`, `toMessage`, or `OperationMessage` out of this file — the `Operation → Message` adapter belongs to `@art-lib/operations` and is tracked on `Plan: Add Operations Package`. This iteration only changes mode plumbing.

**Instructions:**

::switch `agent-worker` — switch to the agent-worker agent mode before changing files. There is no instruction file for this iteration — report in chat (happy face + up to 3 bullet points).

Execute the Changes listed above.

Before starting:

- Run `npm ci` from the `$WORKSPACE` root, then from `$WORKSPACE/checkouts/art-works`.
- Read `$ART_LIB/libs/logger/knowledge/design/logger.md` for the three mode semantics.
- Confirm `npm view @art-lib/logger version` returns `0.0.2` before bumping the dependency; if it does not, `REPORT A BLOCKER` and stop.

Validate that:

- `-o` is declared exactly once in `index.ts`, at program level, and no command declares its own.
- No `*Options` type still carries `output?: string`.
- No call site reads `options.output`; all go through `command.optsWithGlobals()`.
- `createCommandContext` lives in `src/private/context/` and defaults to `normal`.
- With no `-o` flag, output is `normal` (successes visible, `debug` hidden); with `-o quiet`, only warnings and errors; with `-o verbose`, everything including `debug`.
- `npm run ci` passes from `$WORKSPACE/checkouts/art-works/cli/workspace`, and CLI behaviour is otherwise unchanged.

After executing:

- Execute the **Verifying Completion** instructions from the Operating Instructions section, from `$ART_WORKS/cli/workspace`.
- Commit `update-cli-output-flag` in the **Art Works** repository with the blueprint message below.

```text
refactor(workspace-cli): Adopt the three output modes with a single -o flag.

- One program-level `-o`, defaulting to `normal`; drop the eleven per-command flags.
- Extract `createCommandContext` to `private/context` and type the mode as `OutputMode`.
```

**Dependencies:**

- Iteration: Publish Logger 0.0.2 — the CLI re-installs the version that carries `normal`.

#### Commits:

| ID                       | Repository / Checkout / Branch    | Policy       | Hash      | Status      |
| ------------------------ | --------------------------------- | ------------ | --------- | ----------- |
| `update-cli-output-flag` | Art Works / `$ART_WORKS` / `main` | `AUTONOMOUS` | `4a100fb` | `COMMITTED` |

##### Commit: `update-cli-output-flag`

**Message:**

```text
refactor(workspace-cli): Adopt the three output modes with a single -o flag.

- One program-level `-o`, defaulting to `normal`; drop the eleven per-command flags.
- Extract `createCommandContext` to `private/context` and type the mode as `OutputMode`.
```

---

## Coordination

### Not In Scope

- **Operation model and operations log** — stay in `@art-lib/operations` (`/model`, `/log`).
- **Consumer adoption beyond Art Works** — `@art-works/workspace-cli` is the first consumer (Iteration: Integrate in Consumer); other CLIs migrate in their own projects.

### Evidence

- **Scaffold iteration completed (2026-11-01).** `libs/logger/` created as a fully policy-compliant package: `_records/package.art` written first, with the manifest rendered from it. `package.json` carries `repository` (https endpoint, repo-relative `directory`), `publishConfig` `{ "access": "public" }`, policy key order, and `files` with all three required artefacts; keywords are composed per the matrix — own `library, logging, messages` plus Art Lib's `art, terminal-apps` — with no set copied from another package. Build files present (`build.config.mjs`, `tsconfig.build.json`, `.prettierignore`, `.npmignore`), plus `LICENSE-MIT`, `CHANGELOG.md`, and both records (`npm-deployment.art` is `PLANNED`). The description is byte-identical between record and manifest; `npm run build` and a bare `npm run lint` both pass on a built tree; `npm pack --dry-run` lists LICENSE and CHANGELOG. Commit `ac059a8`.
- **Buffering logger iteration completed (2026-11-02).** `libs/logger/src/` gained `message/types.ts`, `message/createMessage.ts`, `types.ts`, `createLogger.ts`, and two test files; `src/index.ts` exports the full surface (five creators, `createLogger`, `Message`, `MessageLevel`, `LoggerAPI`, `LogFormatter`, `LogWriter`, `OutputMode`). Buffer-until-mode-set semantics hold: nothing emitted before `setOutputMode`, `quiet` discards then filters to `warning`/`error`, `verbose` flushes the buffer in order. (As verified at `b9c7dbb` for `0.0.1`; the `quiet` discard is superseded by `Iteration: Add Normal Output Mode`, which flushes and filters instead.) 23/23 tests green, coverage 100/96.96/100/100, no `it.todo()`; `npm run ci` green from `$PROJECT` (pre-commit `0-clean`/`1-extract`/`2-ci` too). No `@art-lib/operations` import anywhere in the package — messages only. Commit `b9c7dbb` pushed to `origin/main`. See `./plan-add-logger/instructions/implement-buffering-logger__report.md`.
- **Acceptance criteria for `Iteration: Implement Buffering Logger` met:** the package builds, lints, and tests green from `$PROJECT/libs/logger`, the exported API matches the design record, and buffer semantics are asserted in `createLogger.test.ts`.
- **Conventions iteration completed (2026-11-02).** No new conventions were installed — `@noodlestan/conventions-typescript@0.1.0` and `@noodlestan/conventions-unit-tests@0.1.0` are already at manifest version and declared in `$PROJECT/_guide.md ## Conventions`, so that file needed no edit (jsx/scss/solidjs don't apply; `commits` is workspace-level, outside package scope). Findings resolved with behaviour identical: 4 `interface` → `type` (plus `_guide.md` prose), named `CreateLoggerOptions`/`CreateMessageOptions`, one exported function per file (the four creators split out of `createMessage.ts`), `extractErrorMessage` → `message/private/`, `formatTiming`/`formatDefaultMessage`/`writeDefaultLines` + `FormattableMessage` → `src/private/`, `buffer` → `bufferedMessages`. Setup findings (scripts, tsconfig, eslint/vitest wiring, ignores, `build.config.mjs`) already byte-matched `libs/fs-records`. Verification green: package `lint`/`build`/`test` (23/23, no `it.todo()`, coverage 100/96.96/100/100) plus `npm run ci` from `$PROJECT` and from `$WORKSPACE`. Commit `4408461` pushed to `origin/main`.
- **Update Knowledge iteration completed (2026-11-02).** `libs/logger/README.md` (consumer-facing `## Usage`) plus the package knowledge base — `knowledge/{index,overview}.md`, `knowledge/design/logger.md`, `knowledge/adr/logger.md` — created, with every relative link script-checked. Repository wiring complete: Logger → `IMPLEMENTED` in `knowledge/components.md`, a Package Knowledge References row in `knowledge/index.md`, `Package: Art Lib Logger` in `_records/project.art`, and the layout plus Knowledge References in `_guide.md`. Delegator addition applied as well: the stale "Message interface" wording in `knowledge/design/logger.md` and `knowledge/components.md` now matches the `type` the conventions iteration shipped. Verification green from `libs/logger/` (lint/build/test 23/23, no `it.todo()`), `npm run ci` from `$PROJECT`, and Prettier from `$WORKSPACE`. Commit `7767871` pushed to `origin/main` (it also carried the other session's already-local `23e123d`, `backlog(art-lib): Close \`add-config\` and move it to \`done\``).
- **Published (2026-11-03).** `@art-lib/logger@0.0.1` is live on `https://registry.npmjs.org` — confirmed by `npm view`: `dist-tags.latest` → `0.0.1`, shasum `9b69f98d42a1e1a15d…` matching `npm pack --dry-run`, `deps: none`, `MIT`, and `description` / `keywords` (`library, logging, messages, art, terminal-apps`) / `engines` (`node >=22`) byte-identical to `_records/package.art`. All four preconditions passed before the registry was touched (whoami `noodlestan`, version absent, policy manifest fields, all four `files` entries on disk); no OTP was demanded. Records flipped to `Published: true` / `DEPLOYED` in `1091288`, which carries only those two edits — `version` and `CHANGELOG.md` untouched. Registry cache lag observed: `npm view` served a cached 404 for ~3 minutes after the publish while a direct `curl` returned 200 immediately.
- **Consumer integration completed (2026-11-03).** `@art-lib/logger@0.0.1` adopted in `$WORKSPACE/checkouts/art-works/cli/workspace`: declared alongside `@art-lib/fs-records` (plus its lock entry), and `src/private/logger/createLogger.ts` now delegates to the package logger with the CLI's own formatter (`makeOperationLogLine(op, {standalone:true}).join(' | ')`) and an `console.info` writer, mapping outcome → level (`pending→info`, `success→warning`, `failure→error`) so `quiet` still drops pending work; `makeOperationLogLine.ts` stays as the renderer and report row builder. No callers or test helpers needed edits — the local `LoggerAPI` shape is unchanged. Gate verified first (`npm view @art-lib/logger version` → `0.0.1`, documented API present in `dist/index.d.ts`). Verification green: `npm run ci` in `cli/workspace` (prettier/eslint/tsc, build, 347 unit + 26 integration tests) and at the Art Works root, hooks `0-clean`/`1-extract`/`2-ci` green. Behaviour unchanged — baseline vs new build diff over `sanity -o verbose|quiet` and `clone NoSuchRepo -o verbose|quiet` shows identical stdout/stderr; the only diffs were the report's `ms` cell and the repo's own `uncommitted files` state. Commit `bf2fc78` pushed to `origin/main` in the Art Works repository; `$PROJECT` left untouched.
- **Add Normal Output Mode completed (2026-11-04).** `OutputMode` is `'quiet' | 'normal' | 'verbose'` in `libs/logger/src/types.ts`; `shouldEmit` is three-tier (`verbose` all, `normal` `level !== 'debug'`, `quiet` `warning`/`error`) and `setOutputMode` now runs every buffered message through `shouldEmit` — all modes flush and filter, none discards, so the `quiet`-discards remnant is gone. Tests cover each mode's flush (buffered `warning` survives `quiet`, buffered `info` survives `normal`, buffered `debug` drops) — 24/24 green, no `it.todo`, coverage 100/97.14/100/100; package `lint`/`build` green and `$PROJECT` `npm run ci` green; no `@art-lib/operations` import. The six mode-spec docs were already three-mode in `dc03a01`; the worker's commit fixed the last `quiet`-discards sentence in `knowledge/overview.md`. Commit `ef5858e` pushed to `origin/main` (rebased over `2e520eb`; the push also carried already-local `dc03a01` and `e82909b`). Out of scope and left uncommitted: the workspace root `package.json`/`package-lock.json` carry another session's `@art-works/workspace-cli` `0.3.1` bump, which made the root `npm ci` fail until the worker repaired the lock with `npm install --package-lock-only`.
- **Published 0.0.2 (2026-11-06).** `@art-lib/logger@0.0.2` is live — `npm view` returns `0.0.2`, `dist-tags.latest` → `0.0.2`, versions now `[0.0.0-stage, 0.0.1, 0.0.2]`. All six preconditions passed before the registry was touched (`whoami` `noodlestan`; logger read `0.0.1` with `0.0.2` → E404; manifest `private`/`publishConfig`/`files` conform; all four `files` entries on disk); no OTP demanded, nothing unpublished. Tarball carries `dist/index.mjs`, `dist/index.d.ts`, `README.md`, `LICENSE-MIT`, `CHANGELOG.md`. Commit `296e359` pushed to `origin/main` — exactly three files: `libs/logger/package.json`, `libs/logger/CHANGELOG.md`, `package-lock.json`. Both records untouched and still `Published: true` / `DEPLOYED`. Verification green: package `lint`/`build`/24 tests, `$PROJECT` `npm run ci` 4/4 (now including `@art-lib/operations`). Registry lag ~90s before `npm view` served the new version.
- **Lockfile coupling confirmed and accepted (2026-11-06).** `libs/operations/package.json` pins `"@art-lib/logger": "0.0.1"` exactly (from `Plan: Add Operations Package`), so the bump could no longer dedupe: npm nested a registry copy at `libs/operations/node_modules/@art-lib/logger@0.0.1`. Pre-delegation probe verified `npm ci` + `npm run ci` stay green (4/4) with it present; the worker committed the refreshed lock as instructed. **Not fixed here** — the pin belongs to the operations plan, which must move it to `0.0.2` when the Art Workspace Cli adopts the three modes.

### Findings

- **The package `description` still says "quiet and verbose" at `0.0.2` — stale, and now contradicts the README.** `_records/package.art` and `libs/logger/package.json` both read _"…a buffering logger: quiet and verbose output modes…"_ (unchanged since `ac059a8`/`1091288`), while `README.md`'s tagline — added in `dc03a01` — reads _"quiet, normal, and verbose output modes"_. The plan's own artefact rule says the README tagline and the record description are **one and the same sentence**, so they now disagree, and the npm listing for `0.0.2` advertises a two-mode logger that no longer exists. The iteration's validation checked `README.md` against the three-mode behaviour but never the description against the README, so it shipped. Needs a `## 0.0.3` (or a docs-only correction) plus a `reconcile`/`records` commit updating both carriers — see Follow Ups.

- Art Works and Art MD both implement the same buffering logger (quiet/verbose, buffer until mode set); the only variation is the log-line formatter and the writer target.
- `libs/logger/package.json` omits the `dependencies` and `devDependencies` keys entirely, whereas `libs/fs-records` and `libs/config` both declare `"devDependencies": {}`. Policy does not require the key when a package has none, so this is not a compliance failure — only a sibling inconsistency. Harmless; align it if a later iteration touches the manifest.
- **`libs/logger` was missing from `package-lock.json`'s `packages` map** — the same gap `libs/config` had — so `npm ci` from `$PROJECT` failed with `Missing: @art-lib/logger@0.0.1 from lock file`. Repaired during setup with `npm install --package-lock-only` (12-line additive diff) and committed on its own as `21f3d56` (`fix(art-lib): Sync package-lock with package.json so npm ci works.`), mirroring `20ac101`. `npm ci` and `npm run ci` are green from `$PROJECT` again.
- **The `@art-lib/logger` packument carries a `0.0.0-stage` placeholder** — "Temporary package placeholder for staged publishing", created 16:29:10Z, between the publish worker's precondition check and its publish, and not created by this plan's worker. It sorts below `0.0.1` and `dist-tags.latest` still points at `0.0.1`, so nothing of ours is shadowed; per policy it was not unpublished. Someone or something else is running staged publishing against this package — worth confirming whether that placeholder is expected before `@art-lib/operations` publishes.

### Decisions

- Split from `@art-lib/operations` per the milestone decision — logger is effectful (wraps the log writer); operations stay in `@art-lib/operations`.
- **The logger knows only messages** — one `Message` interface with severity levels; operations conform to it structurally, so the logger has no dependency on `@art-lib/operations` (and no cycle is possible).
- The log writer is injectable (`LogWriter`) so tests and future sinks (file, reactive layer) do not touch `console.error` directly.
- **Three output modes, not two (2026-11-03).** `OutputMode` is `'quiet' | 'normal' | 'verbose'` with `normal` as the middle tier and the CLI's default: `verbose` emits everything, `normal` emits `info`/`warning`/`error`, `quiet` emits `warning`/`error`. This exists so `@art-lib/operations`' level mapping (`pending → debug`, `success → info`, `failure → error`) works as designed — `normal` shows finished successes, `quiet` shows only problems, `verbose` adds pending work. Without `normal`, a two-mode logger forces the consumer to map `success → warning` to keep successes visible under `quiet`, which is the hack the Art Workspace Cli carries today.
- **Buffer handling: every mode flushes; none discards (resolved 2026-11-03).** `setOutputMode(mode)` applies that mode's rule to whatever is buffered — `verbose` writes everything, `normal` writes `info` and above, `quiet` writes only `warning`/`error` — and drops the rest. The buffer exists because the mode is unknown; once known, the mode's rule governs the buffered messages exactly as it governs later ones, so arrival time never decides survival. This **supersedes the `quiet`-discards behaviour** delivered by `Iteration: Implement Buffering Logger`: discarding made `quiet` swallow the pre-mode warnings it exists to surface, while buying nothing — `info` and `debug` are dropped by the filter anyway.
- **Level mapping stays out of this package.** `pending → debug`, `success → info`, `failure → error` belong to `@art-lib/operations`, as does the `Operation → Message` adapter (`createMessageFromOperation`). The logger only decides which levels each mode admits.

### Knowledge to Update

- Keep the `logger` package entry in `knowledge/components.md` in sync after scaffolding.

### Follow Ups

- **Reconcile the package `description` with the README tagline** — both carriers must read _"…quiet, normal, and verbose output modes…"_. `libs/logger/_records/package.art` + `libs/logger/package.json` are stale; the README is correct. Because `package.json` is published, the fix needs a version bump and publish (docs-only `0.0.3`), or it waits for the next real release. Do **not** hand-edit `package.json` alone — the record is the source of truth and the manifest is its rendering.
- **Bump `libs/operations`' logger pin from `0.0.1` to `0.0.2`** — currently forcing a nested registry copy at `libs/operations/node_modules/@art-lib/logger`. Belongs to `Plan: Add Operations Package` (`Update Knowledge` or `Integrate in Consumer`).

- ~~**No iteration in this plan publishes `@art-lib/logger`.**~~ — **resolved 2026-11-02.** `Iteration: Publish Logger Package` (`publish-logger-package`) was added between `Update Knowledge` and `Integrate in Consumer`, mirroring `Plan: Add Config Package`'s `publish-config-package`, and `Integrate in Consumer`'s gate now reads on it instead of on the whole plan being `DONE`.
- ~~`$PROJECT/knowledge/design/logger.md` still calls `Message` an **interface**~~ — **resolved 2026-11-02** by `Iteration: Update Knowledge` (`7767871`): the wording in `knowledge/design/logger.md` and `knowledge/components.md` now matches the `type` shipped by the conventions iteration; no `interface` wording remains in either. The record stays repository-level.
- `@art-works/workspace-cli` adoption is planned here (Iteration: Integrate in Consumer); `@art-md/bin` migrates in its own project.
- **The keywords matrix row is staged in a different repository and is not committed.** `$WORKSPACE/checkouts/management` has `_ops/keywords/matrix.md` staged with the new `@art-lib/logger` row (own keywords only, per the matrix model). It lives in the management repo, not this one, and this plan prescribes a single commit — so the worker correctly left it staged. It needs its own commit in `checkouts/management` before the matrix is truthful again.
- **`@art-lib/config` still has no row in that matrix**, and its manifest is missing `repository` and `publishConfig`. Both are tracked on `Plan: Add Config Package`'s Follow Ups and remain open.

### Feedback

- The plan does not render the `Attachments`, `Resource Types in Scope`, `Workflows` / `Workflow Operations`, and `Execution Context` sections the template expects — cosmetic only (the worker's entry point is a self-contained instruction file); apply the next time this plan is edited.
- `instructions/implement-buffering-logger.md` cites `$WORKSPACE/_guide.md` for `npm run ci`, but that guide puts `npm run ci` under Verifying Step and the workspace root `ci` only runs Prettier — the build-green check is `$PROJECT`'s `npm run ci` (pre-commit `2-ci`) plus the package-level Verifying Completion. The delegator resolves this in the delegation prompt; the next instruction file should cite `$PROJECT/_guide.md`.
- **From the buffering-logger worker (2026-11-02):** the instruction was executed verbatim and was self-sufficient — goals, steps, commit blueprint, and verification commands needed no clarification. Two deliberate non-commits: `package-lock.json` (the setup repair, now `21f3d56`) and this plan's `Feedback` edit, both outside the instruction's single-commit scope; the report file itself is written next to the instruction and is not committed.
- **The conventions blueprint message is invalid (2026-11-02):** `style(logger): Apply Noodlestan conventions.` uses `style`, which is not in the allowed-types table of `$WORKSPACE/knowledge/conventions/writing-commit-message.art` and has never appeared in history. The worker flagged it instead of committing blind, and the user chose `refactor(logger)`. Correct blueprints against that table before delegating — `Plan: Add Config Package` carries the same `style(config)` defect in its conventions iteration (there it never bit, because the changes rode into `8f2d84e`).
- **From the conventions worker (2026-11-02):** executed as instructed; the `MANUAL` hold plus the message flag were the right calls. Two notes worth carrying: `$PROJECT/knowledge/design/logger.md` still says "Message interface" (tracked under Follow Ups), and a concurrent session was editing `libs/config` knowledge files in the same working tree — its 12 staged files were kept out of `4408461` by committing the `libs/logger` pathspec only.
- ~~**The Operating Instructions cite `ops/*.art` paths that do not exist (2026-11-04):** `setting-up`, `writing-commit-message`, and `verifying-completion` are referenced as `$DOMAINS/work/workflows/{planning,executing}-work/ops/*.art`, but the layout is `$DOMAINS/work/workflows/{workflow}/{operation}/operation.art`. The command bodies are inlined in this plan, so no worker is affected — cosmetic; apply the next time this plan is edited.~~ — **resolved 2026-11-05:** all three now point at `$DOMAINS/work/workflows/{workflow}/{operation}/operation.art`, alongside the manifest-policy repoint (`management/_ops/packages/policy.md` → `ops/knowledge/design/manifest-policy.md`) and the retired repository-level design record.
- **The `integrate-logger-in-consumer` blueprint message carries a typo** — "Replace the local local buffering logger with `@art-lib/logger`" — and was committed verbatim as `bf2fc78` because the instruction says to use the blueprint. Correct the doubled "local" before this message is reused.
