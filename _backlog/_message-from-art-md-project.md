# Message from Art MD Project: CLI Abstraction Proposals

**From:** Art MD Project (`checkouts/art-md-planning`)
**To:** Art Lib Project (`checkouts/art-lib-planning`)
**Date:** 2026-09-26
**Subject:** Proposed CLI abstraction packages based on side-by-side comparison of `@art-work/cli` and `@art-md/bin`

---

## Context

Art MD is implementing `@art-md/bin` — a CLI package exposing three entry points (`art-codec`, `art-parse`, `art-serialize`) that wrap `@art-md/codec` operations. The design deliberately follows the Art Work CLI patterns (`$ART_WORK/cli/work`): entry point → `run{CommandName}` → `do{OperationName}` → log operations → present outputs.

A full side-by-side comparison was performed between the Art Work CLI (implemented, ~12 commands) and the codec bin (planned, 2 commands). The comparison shows that **approximately 60% of the CLI plumbing is identical** across both projects. This message proposes six abstraction packages for `@art-lib` that would eliminate the duplication.

**Full comparison:** `$PROJECT/_backlog/6-plan/plan-update-bin-knowledge/comparison__codec-bin-vs-art-work.md`

---

## The Two CLI Projects

### Art Work CLI (`@art-work/cli`)

- **Binary:** `art-workspace`
- **Commands:** `clone`, `branch`, `pull`, `push`, `sync`, `sanity`, `checkouts run`, `repo`, `link`, `unlink`, `publish`
- **Domain:** Workspace orchestration across multiple git repositories
- **Context:** `WorkspaceContext { config, store, log, workspace? }` — holds checkout store and operations log
- **Config:** `.art-workspace.mts` loaded via esbuild at runtime
- **State:** Persistent — `saveCheckoutRecord` per mutation
- **Reports:** Rich markdown-table reports (Checkout Report, Operations Report, Extraneous Report)

### Codec Bin (`@art-md/bin`)

- **Binaries:** `art-codec`, `art-parse`, `art-serialize`
- **Commands:** `parse`, `serialize`
- **Domain:** Document parsing and serialisation via `@art-md/codec`
- **Context:** `CodecContext { config, codec, log, io }` — holds codec instance and file I/O helpers
- **Config:** `package.json` + optional CLI overrides
- **State:** Stateless between invocations
- **Reports:** Direct stdout/JSON output

---

## Proposed Abstraction Packages

### Package 1: `@art-lib/cli-operations`

**What:** The operation model, factories, and types.

**Identical in both projects:**

- `OperationOutcome = 'pending' | 'success' | 'failure'`
- `OperationBase { operation, ts, finishedTs?, outcome, message(), timing() }`
- `OperationPending`, `OperationSuccess`, `OperationFailure` (adds `error`, `errorSerialized()`)
- `createGenericOperation(operation, data?)`
- `createOperationSuccess(pending, message?)`
- `createOperationFailure(pending, error)`

**Deviation:** Art Work has a hardcoded `errorLabels` map (`clone: 'CloneError'`, `push: 'PushError'`, etc.). The codec bin would use a different map (`parse: 'ParseError'`, `serialize: 'SerializeError'`).

**Proposed API:**

```ts
export type OperationOutcome = 'pending' | 'success' | 'failure';

export interface OperationBase {
  operation: string;
  ts: Date;
  finishedTs?: Date;
  outcome: OperationOutcome;
  message(): string;
  timing(): number;
}

export interface OperationPending extends OperationBase {
  outcome: 'pending';
  data?: unknown;
}

export interface OperationSuccess extends OperationBase {
  outcome: 'success';
}

export interface OperationFailure extends OperationBase {
  outcome: 'failure';
  error: string;
  errorSerialized(): string;
}

export function createGenericOperation(operation: string, data?: unknown): OperationPending;
export function createOperationSuccess<T extends OperationPending>(
  pending: T,
  message?: string,
): OperationSuccess;
export function createOperationFailure<T extends OperationPending>(
  pending: T,
  error: unknown,
  options?: { label?: string },
): OperationFailure;
```

**Adoption in Art Work:** Replace hardcoded `errorLabels` with `{ label: errorLabels[pending.operation] }` passed to `createOperationFailure`.

**Adoption in codec bin:** Import directly; pass `{ label: 'ParseError' }` / `{ label: 'SerializeError' }`.

**Estimated savings:** ~150 lines duplicated across both projects.

---

### Package 2: `@art-lib/cli-logger`

**What:** The buffering logger with output modes.

**Identical in both projects:**

- `LoggerAPI { log(op), setOutputMode(mode) }`
- Buffer pending operations until mode is set
- `quiet` mode: discards buffer, drops future pending ops
- `verbose` mode: flushes buffer, shows all ops including pending
- Delegates log line formatting to an injected formatter

**Deviation:** None in behaviour. The only difference is the formatter function passed in (Art Work uses 6-column formatter; codec bin uses 4-column formatter).

**Proposed API:**

```ts
export interface LoggerAPI {
  log(op: Operation): void;
  setOutputMode(mode: string | undefined): void;
}

export interface LogFormatter {
  format(op: OperationBase): string[];
}

export function createLogger(options?: { formatter?: LogFormatter }): LoggerAPI;
```

**Adoption in Art Work:** Replace local `createLogger` with import; inject `makeOperationLogLine` as formatter.

**Adoption in codec bin:** Import directly; inject a simpler formatter.

**Estimated savings:** ~50 lines duplicated.

---

### Package 3: `@art-lib/cli-operations-log`

**What:** The append-only operations log that wraps a logger.

**Identical in both projects:**

- `OperationsLog { log(op), all(), since(ts), latest(n) }`
- Stores completed operations (excludes pending)
- Delegates to injected logger for side effects

**Deviation:** None. This is 100% generic.

**Proposed API:**

```ts
export interface OperationsLog {
  log(operation: Operation): void;
  all(): Operation[];
  since(ts: Date): Operation[];
  latest(n: number): Operation[];
}

export function createOperationsLog(logger?: (op: Operation) => void): OperationsLog;
```

**Adoption in both projects:** Replace local implementation with direct import.

**Estimated savings:** ~35 lines duplicated.

---

### Package 4: `@art-lib/cli-command-runner`

**What:** The generic command action skeleton that every command repeats.

**Identical pattern in both projects:**

Art Work repeats this 12 times (once per command):

```ts
const root = process.cwd();
logger.log(createGenericOperation('boot'));
const config = await loadWorkspaceConfig(root);
const store = createCheckoutStore();
const log = createOperationsLog(logger.log);
const ctx = createWorkspaceContext(config, store, log);
logger.setOutputMode(options.output || config.output.mode);
await run{CommandName}(ctx, options);
```

Codec bin would repeat this 3 times:

```ts
const root = process.cwd();
logger.log(createGenericOperation('boot'));
const config = await loadBinConfig(root);
const codec = createArtCodec(config.codec);
const log = createOperationsLog(logger.log);
const ctx = createCodecContext(config, codec, log, io);
logger.setOutputMode(options.output || config.output.mode);
await run{CommandName}(ctx, options);
```

**Proposed API:**

```ts
export interface CommandRunnerConfig<Context, Config> {
  loadConfig: (root: string) => Promise<Config> | Config;
  createContext: (config: Config, log: OperationsLog, ...deps: unknown[]) => Context;
  createLogger: () => LoggerAPI;
  createOperationsLog: (logger: LoggerAPI) => OperationsLog;
  getOutputMode: (options: unknown, config: Config) => string | undefined;
}

export function createCommandRunner<Context, Config>(
  runnerConfig: CommandRunnerConfig<Context, Config>,
): {
  wrap<Options>(
    handler: (ctx: Context, options: Options) => Promise<unknown>,
  ): (options: Options) => Promise<void>;
};
```

**Adoption in Art Work:**

```ts
const runner = createCommandRunner({
  loadConfig: loadWorkspaceConfig,
  createContext: (config, log) => createWorkspaceContext(config, createCheckoutStore(), log),
  createLogger,
  createOperationsLog,
  getOutputMode: (options, config) => options.output || config.output.mode,
});

program.command('clone').action(runner.wrap(runClone));
```

**Adoption in codec bin:**

```ts
const runner = createCommandRunner({
  loadConfig: loadBinConfig,
  createContext: (config, log) => createCodecContext(config, createArtCodec(config.codec), log, io),
  createLogger,
  createOperationsLog,
  getOutputMode: (options, config) => options.output || config.output.mode,
});

program.command('parse').action(runner.wrap(runParse));
```

**Estimated savings:** ~80 lines of boilerplate per project (960 lines in Art Work, 240 in codec bin).

---

### Package 5: `@art-lib/cli-test-helpers`

**What:** Generic CLI test utilities.

**Identical pattern in both projects:**

- `makeConfigMock<Config>(defaults, overrides?)` — returns a config with defaults overridden
- `makeCommandContextMock<Context>(configMock, ...deps)` — builds a context from the config mock
- `makeTempDir()` / `removeTempDirs()` — filesystem test helpers
- `delay(ms)` — async test helper

**Deviation:** The concrete types differ (`WorkspaceConfig` vs `BinConfig`, `WorkspaceContext` vs `CodecContext`), but the pattern is identical.

**Proposed API:**

```ts
export function makeConfigMock<Config>(defaults: Config, overrides?: DeepPartial<Config>): Config;

export function makeCommandContextMock<Context>(
  makeContext: (...args: unknown[]) => Context,
  ...args: unknown[]
): Context;

export function makeTempDir(): Promise<string>;
export function removeTempDirs(): Promise<void>;
export function delay(ms: number): Promise<void>;
```

**Adoption in both projects:** Replace typed copies with generic versions.

**Estimated savings:** ~100 lines duplicated across both projects.

---

### Package 6: `@art-lib/cli-present` (Interface Only)

**What:** A presenter interface for operation log lines.

**Pattern:** Both projects format operations as `string[]` arrays for console output, but the columns differ.

**Proposed API:**

```ts
export interface OperationLogLinePresenter {
  present(op: OperationBase): string[];
}

export interface ReportPresenter<Context> {
  present(ctx: Context): string;
}
```

**Why interface only:** The actual column formats are too project-specific to share as implementations, but the **contract** is identical. This package would contain only the interface definitions and perhaps a few generic utilities (e.g., `truncateMiddle`, timing formatting).

**Estimated savings:** Minimal direct savings, but establishes a shared contract.

---

## What Should NOT Be Extracted

| Unit                                                  | Reason                                                  |
| ----------------------------------------------------- | ------------------------------------------------------- |
| `CheckoutStore` / `createCheckoutStore`               | Domain-specific to Art Work's repo/checkouts model      |
| `loadWorkspaceConfig` / `.art-workspace.mts` bundling | Art Work's config format is unique                      |
| `saveCheckoutRecord`                                  | State persistence is Art Work-specific                  |
| Markdown-table reports                                | Presentation is too domain-specific                     |
| `createArtCodec` / codec operations                   | Already lives in `@art-md/codec`                        |
| `buildProgram` with commander                         | Too thin; commander is already the abstraction          |
| `buildParseCommand` / `buildSerializeCommand`         | These are the command specs; they belong to the product |

---

## Recommended Priority Order

1. **`@art-lib/cli-operations`** — Highest impact, zero dependencies, 100% identical
2. **`@art-lib/cli-logger`** — High impact, depends on `cli-operations`, 100% identical behaviour
3. **`@art-lib/cli-operations-log`** — High impact, depends on `cli-logger`, 100% generic
4. **`@art-lib/cli-command-runner`** — Highest boilerplate elimination, depends on all three above
5. **`@art-lib/cli-test-helpers`** — Medium impact, improves test consistency across projects
6. **`@art-lib/cli-present`** — Lowest priority, mainly interface definitions

---

## Use Case Summary for Art Lib

The Art Lib project charter is to **"Build high quality, consistent, CLI and Tool experiences from composable units."** This proposal directly serves that charter:

- **Consistency:** Both Art Work and Art MD CLIs would use the same operation model, logger, and command skeleton, making it easier for developers to move between projects.
- **Composability:** Each package is independent — a project can adopt `cli-operations` without adopting `cli-command-runner`.
- **Quality:** The shared packages would be tested once and reused, reducing the bug surface area.
- **Fed by use cases:** This proposal comes from two real, implemented (or implementing) CLIs, not from speculation.

---

## Next Steps

1. Art Lib reviews this proposal and the full comparison document.
2. Art Lib decides which packages to create and in what order.
3. Art Lib creates the first package (`cli-operations`).
4. Art Work refactors to adopt `cli-operations` (replacing local types and factories).
5. Art MD codec bin implements using `cli-operations` from the start.
6. Repeat for subsequent packages.

**Contact:** This proposal was generated by the Art MD project during the Codec Bin milestone planning. The full comparison with line-by-line analysis is available at:

```
checkouts/art-md-planning/_backlog/6-plan/plan-update-bin-knowledge/comparison__codec-bin-vs-art-work.md
```

---

## Appendix: Files Referenced

| Project  | File                                                                             | Role                                 |
| -------- | -------------------------------------------------------------------------------- | ------------------------------------ |
| Art Work | `cli/work/src/private/operations/types.ts`                                       | Operation model                      |
| Art Work | `cli/work/src/private/operations/createGenericOperation.ts`                      | Generic operation factory            |
| Art Work | `cli/work/src/private/operations/createOperationSuccess.ts`                      | Success factory                      |
| Art Work | `cli/work/src/private/operations/createOperationFailure.ts`                      | Failure factory                      |
| Art Work | `cli/work/src/private/logger/createLogger.ts`                                    | Logger                               |
| Art Work | `cli/work/src/private/log/createOperationsLog.ts`                                | Operations log                       |
| Art Work | `cli/work/src/private/context/createWorkspaceContext.ts`                         | Context factory                      |
| Art Work | `cli/work/src/test/helpers/context/makeConfigMock.ts`                            | Config mock                          |
| Art Work | `cli/work/src/test/helpers/context/makeCommandContextMock.ts`                    | Context mock                         |
| Art Work | `cli/work/src/index.ts`                                                          | Entry point (shows command skeleton) |
| Art MD   | `_backlog/6-plan/plan-implement-bin-commands/plan.md`                            | Planned implementation               |
| Art MD   | `_backlog/6-plan/plan-update-bin-knowledge/comparison__codec-bin-vs-art-work.md` | Full comparison                      |
