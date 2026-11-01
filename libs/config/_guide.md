# Guide: Art Lib Config

The Art Lib Config package (`@art-lib/config`) provides typed config loading with bundle-at-runtime compilation and content-hash cache for CLIs.

## Recommended Reading

Agents SHOULD scan these files for relevant clarifications when faced with ambiguity or omissions that may result from missing definitions.

- `_guide.md` — this file: package overview, layout, and operating instructions.

## Package Layout

```
_guide.md       — this file
_records/       — package records
knowledge/      — package knowledge base (see knowledge/index.md)
src/            — the package source (see tree below)
```

Its `src/` layout:

```
src/
├── index.ts       # public exports: 4 functions + 4 types
├── types.ts       # options, compiled result, and cache metadata types (shared by several domains)
├── compile/       # compileConfig: esbuild bundle-at-runtime + bundle/meta write helpers
├── load/          # loadConfigModule: orchestrator (reuse or compile, then import) + its tests
├── module/        # importConfigModule: dynamic import of the compiled bundle
├── cache/         # findReusableBundle: content-hash cache reuse check + metadata read helpers
└── private/       # cross-domain helpers only (constants, base dir resolution, input path hashing)
```

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`

## Knowledge References

This package maintains a knowledge base at:

- `knowledge/index.md` — Package knowledge: overview, design, and decision records.

The repository-level knowledge index is at `../../knowledge/index.md`; the repository-level design record for this package is `../../knowledge/design/config.md`.

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
