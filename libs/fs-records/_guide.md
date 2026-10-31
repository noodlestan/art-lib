# Guide: Art Lib FS Records

The Art Lib FS Records package (`@art-lib/fs-records`) provides generic Art MD record read/write modules for CLIs.

## Recommended Reading

Agents SHOULD scan these files for relevant clarifications when faced with ambiguity or omissions that may result from missing definitions.

- `_guide.md` — this file: package overview, layout, and operating instructions.
- `knowledge/index.md` — package purpose, layout, components, and design decisions.

## Package Layout

```
knowledge/       — knowledge index, docs, decision records (adr/)
src/             — the package source (see tree below)
CHANGELOG.md
```

Its `src/` layout:

```
src/
├── adapter/      # FSRecordsAdapter factory and types
├── discover/     # discoverRecordFiles and tests
├── files/        # FSContentSource, types, readRecordFileContent
├── private/      # internal helpers (glob, filter, gitignore)
├── test/         # test helpers (config, tempDirs)
└── index.ts      # public exports
```

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`
- **Deployment:** - `_records/npm-deployment.art`

## Knowledge References

This package maintains:

- knowledge reference at `knowledge/index.md` describing the package purpose, layout, components, and design decisions.
- decision records at `knowledge/adr`.

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
