# Guide: Art Lib Operations

The Art Lib Operations package (`@art-lib/operations`) provides the shared CLI operation model — the outcome types and factories that record one unit of work in a command invocation — and an append-only operations log, created with the logger and forwarding every operation to it.

## Recommended Reading

Agents SHOULD scan these files for relevant clarifications when faced with ambiguity or omissions that may result from missing definitions.

- `_guide.md` — this file: package overview, layout, subpath modules, and operating instructions.
- `knowledge/index.md` — package knowledge: overview, design, and decision records.

## Package Layout

```
_guide.md       — this file
_records/       — package and deployment records
knowledge/      — package knowledge base (see knowledge/index.md)
src/            — the package source (see tree below)
```

Its `src/` layout:

```
src/
├── index.ts      # public exports: the package root
├── model/        # ./model subpath: operation types and factories
│   └── index.ts
└── log/          # ./log subpath: append-only operations log
    └── index.ts
```

## Subpath Modules

The manifest exports three entry points:

| Export    | Source entry         | Contents                                                   |
| --------- | -------------------- | ---------------------------------------------------------- |
| `.`       | `src/index.ts`       | package root: re-exports the `./model` and `./log` modules |
| `./model` | `src/model/index.ts` | operation outcome types and factories                      |
| `./log`   | `src/log/index.ts`   | the append-only operations log                             |

- **`/model`** — `OperationOutcome`, the pending/success/failure operation types, and the `createGenericOperation()`, `createOperationSuccess()`, and `createOperationFailure()` factories.
- **`/log`** — `OperationsLog` with `log()`, `all()`, `since()`, and `latest()`, created as `createOperationsLog(logger, options?)`.

Operations conform to the `Message` interface of `@art-lib/logger` structurally — the level is derived from the outcome (pending → `debug`, success → `info`, failure → `error`) — so the logger never learns about operations. `@art-lib/logger` is this package's only dependency.

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`
- **Deployment:** `_records/npm-deployment.art`

## Knowledge References

This package maintains a knowledge base at:

- `knowledge/index.md` — Package knowledge: overview, design, and decision records.

The repository-level knowledge index is at `../../knowledge/index.md`.

## Conventions

This package follows strict conventions.

::READ `../../_guide.md` for repository-wide conventions.

## Workflows

This project uses the following workflows:

| Workflow / Path                                                       | Purpose                                          |
| --------------------------------------------------------------------- | ------------------------------------------------ |
| **Deploying** `$DOMAINS/deployments/workflows/deploying/workflow.art` | Organizes deployment of artefacts in operations. |

## Operating Instructions

### Operating Instructions: Setting Up

**Instructions:**

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

Do NOT run `npm install` inside this package directory — a local `node_modules` there shadows the monorepo resolution and breaks the build.

### Operating Instructions: Verifying Step

**Instructions:**

Run from this package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run test # to run all tests
npm run build # to produce a full build
```

### Operating Instructions: Verifying Completion

**Instructions:**

Run from this package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run build # to produce a full build
npm run test # to run all tests
```

All steps MUST pass. No `it.todo()` tests may remain.
