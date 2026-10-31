# Knowledge: FS Records

The `@art-lib/fs-records` package provides filesystem discovery and content acquisition for Art MD records.

## Documents

| Document                                             | Description                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| [overview.md](overview.md)                           | Package purpose, two-unit design, contracts, and dependencies |
| [components.md](components.md)                       | Module breakdown and responsibility of each                   |
| [adr/adapter-contracts.md](adr/adapter-contracts.md) | Design decisions from the Art Records whiteboard              |

## Layout

Its `src/` layout:

```
src/
├── adapter/ # FSRecordsAdapter factory and types
├── discover/ # discoverRecordFiles and tests
├── files/ # FSContentSource, types, readRecordFileContent
├── private/ # internal helpers (glob, filter, gitignore)
├── test/ # test helpers (config, tempDirs)
└── index.ts # public exports
```

## Related Knowledge

- `$ART_MD/libs/primitives/knowledge/index.md` — `ArtContentSource` contract.
- `$ART_JS/_backlog/whiteboard-art-records/whiteboard.md` — agreed contracts.

> Use these as path-variable references (backticks), not as relative links: this repository has no precedent for links that escape the checkout, and such a link would break wherever the package is consumed without sibling checkouts.
