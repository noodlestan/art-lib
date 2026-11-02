# Guide: Art Lib Logger

The Art Lib Logger package (`@art-lib/logger`) provides the message model — a `Message` type with severity levels and message creators — and a buffering logger with quiet and verbose output modes, an injected formatter, and an injectable log writer.

## Recommended Reading

Agents SHOULD scan these files for relevant clarifications when faced with ambiguity or omissions that may result from missing definitions.

- `_guide.md` — this file: package overview, layout, and operating instructions.
- `knowledge/index.md` — package purpose, layout, components, and design decisions.

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
├── index.ts          # public exports: message model and logger
├── types.ts          # LoggerAPI, LogFormatter, and LogWriter contracts
├── createLogger.ts   # buffering logger: quiet/verbose modes, formatter, writer
├── private/          # default formatter, default writer, and their helpers
└── message/          # Message model: types and message creators
    ├── types.ts      # Message, MessageLevel, and MaybeError contracts
    ├── create*Message.ts # one message creator per file
    └── private/      # helpers shared by the message creators
```

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`
- **Deployment:** `_records/npm-deployment.art`

## Knowledge References

This package maintains a knowledge base at:

- `knowledge/index.md` — Package knowledge: overview, design, and decision records.

The repository-level knowledge index is at `../../knowledge/index.md`; the repository-level design record for this package is `../../knowledge/design/logger.md`.

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

### Operating Instructions: Verifying Step

**Instructions:**

Run from this package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues (prettier, eslint, tsc --noEmit)
npm run test # to run all tests
npm run build # to produce a full build
```
