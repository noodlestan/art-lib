# Guide: Art Lib Config

The Art Lib Config package (`@art-lib/config`) provides typed config loading with bundle-at-runtime compilation and content-hash cache for CLIs.

## Recommended Reading

Agents SHOULD scan these files for relevant clarifications when faced with ambiguity or omissions that may result from missing definitions.

- `_guide.md` — this file: package overview, layout, and operating instructions.

## Package Layout

```
_guide.md       — this file
_records/       — package records
src/            — the package source (see tree below)
```

Its `src/` layout:

```
src/
├── cache.ts               # findReusableBundle: content-hash cache reuse check
├── compileConfig.ts       # esbuild bundle-at-runtime compilation
├── importConfigModule.ts  # dynamic import of the compiled bundle
├── loadConfigModule.ts    # orchestrator: reuse or compile, then import
├── types.ts               # options, compiled result, and cache metadata types
├── private/               # internal helpers (constants, hashing, cache meta, fs)
└── index.ts               # public exports
```

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`

## Knowledge References

This package maintains no knowledge references yet; they are added together with the package modules.

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
