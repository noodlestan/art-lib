# @art-lib/fs-records

> Filesystem discovery and content acquisition for Art MD records.

This package is part of the [Art Lib toolkit](../../README.md).

## Design

The package has two units. `FSRecordsAdapter` discovers record files and creates
an `FSContentSource` for each file. Each `FSContentSource` implements the
`ArtContentSource` contract from `@art-md/primitives` and handles content
reading and writing for one file.

## Exports

| Export                                            | Description                                                            |
| ------------------------------------------------- | ---------------------------------------------------------------------- |
| `createFSRecordsAdapter(options)`                 | Create an adapter for discovering files and creating content sources.  |
| `createFSContentSource(file)`                     | Create a content source for one file.                                  |
| `discoverRecordFiles(basePath, patterns, kinds?)` | Discover matching record files, optionally filtered by kind.           |
| `readRecordFileContent(file)`                     | Read the content of a record file.                                     |
| `FSRecordsAdapter` (type)                         | Adapter interface for discovery and content-source creation.           |
| `FSRecordsAdapterOptions` (type)                  | Options containing the base path and discovery patterns.               |
| `FSContentSource` (type)                          | One-file source implementing `ArtContentSource`.                       |
| `FSRecordFile` (type)                             | Metadata and optional content or error for a discovered file.          |
| `FSRecordsPattern` (type)                         | Base, glob patterns, exclusions, and gitignore settings for discovery. |

## Usage

```ts
import { createFSRecordsAdapter } from '@art-lib/fs-records';

const adapter = createFSRecordsAdapter({
  basePath: './records',
  patterns: [
    {
      base: '.',
      pattern: '**/*.art',
      ignored: [],
      excluded: [],
      gitignore: true,
    },
  ],
});

const [file] = await adapter.discoverRecordFiles();
if (file) {
  const contentSource = adapter.createContentSource(file);
  const content = await contentSource.readContent();
  console.log(content);
}
```

## Development

Make sure you read the [Art Lib README](../../README.md) first.

### Build Targets

This package is meant for use in Node.js environments. The entry point is built using `esbuild` pre-configured by [Workspace Tooling](https://github.com/noodlestan/workspace-tooling).

### Scripts

- **$** `npm run dev` — Watch mode for development
- **$** `npm run lint` — Check formatting, lint, and type check
- **$** `npm run lint:fix` — Fix formatting and lint issues
- **$** `npm run build` — Build the CLI package
- **$** `npm run build:clean` — Remove build artifacts
- **$** `npm run test` — Run tests
- **$** `npm run ci` — Run CI pipeline

## Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
