# Sub-Agent REPORT (#producer)

**Plan:** `add-config`

**Iteration Id:** `implement-config-cache`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal                                                                                                                                                             | Status    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Content-hash cache in `cacheDir` (`config.bundle.mjs` + `config.cache.json`, sha256 per esbuild `metafile.inputs` entry, relative to `baseDir`, `version` field) | Delivered |
| Reuse the cached bundle only while every recorded input hashes the same                                                                                          | Delivered |
| Changed/missing/unreadable input, missing bundle, unparseable metadata, or version mismatch triggers a rebuild                                                   | Delivered |
| Unwritable cache degrades to a temp bundle with a warning — never fails the run                                                                                  | Delivered |
| `options.cache === false` bypasses reuse, rebuilds, and refreshes the cache                                                                                      | Delivered |

`metafile: true` was already set on the esbuild call by the previous iteration; the cache check in `loadConfigModule` reuses the same `resolveConfigBaseDir` derivation as `compileConfig` so write-time and read-time paths stay symmetric. Verification of recorded inputs resolves them against the realpath'd `baseDir` — this surfaced during verification on macOS, where `tmpdir()` paths are `/var/...` symlinks to `/private/var/...` and esbuild records realpath-based input keys; without the realpath the reuse check never matched.

#### Files changed

- `$PACKAGE/src/cache.ts` (new) — `findReusableBundle(cacheDir, baseDir)`: reads and guards the cache metadata, verifies the bundle exists, re-hashes every recorded input (sha256, content-based, relative to `baseDir`), and returns the bundle path only when all match; re-exports the cache metadata helpers `readConfigCacheMeta` and `isConfigCacheMeta`.
- `$PACKAGE/src/private/constants.ts` (new) — `CONFIG_BUNDLE_FILENAME`, `CONFIG_CACHE_FILENAME`, `CONFIG_CACHE_VERSION`, `TEMP_DIR_PREFIX` shared by the writer and the reader.
- `$PACKAGE/src/private/isConfigCacheInput.ts` (new) — shape guard for recorded inputs.
- `$PACKAGE/src/private/isConfigCacheMeta.ts` (new) — version + shape guard for cache metadata.
- `$PACKAGE/src/private/readConfigCacheMeta.ts` (new) — reads/parses/guards `config.cache.json`; returns `null` on missing, unparseable, or mismatched metadata.
- `$PACKAGE/src/private/isFilePresent.ts` (new) — bundle existence check.
- `$PACKAGE/src/private/hashConfigInputPaths.ts` (new) — sha256-over-content hashing extracted from `hashConfigInputs` so recorded inputs can be re-hashed at verification time.
- `$PACKAGE/src/private/tryHashConfigCacheInputs.ts` (new) — re-hashes recorded inputs against the realpath'd `baseDir`; `null` on missing/unreadable input.
- `$PACKAGE/src/private/hasUnchangedConfigInputs.ts` (new) — recorded-vs-current hash comparison.
- `$PACKAGE/src/private/resolveConfigBaseDir.ts` (new) — shared `baseDir` derivation (`options.baseDir ?? entry dir`).
- `$PACKAGE/src/loadConfigModule.ts` — checks `findReusableBundle(cacheDir, baseDir)` before compiling, imports the reusable bundle when found, and skips reuse on `cache: false`.
- `$PACKAGE/src/compileConfig.ts` — uses the shared `resolveConfigBaseDir`.
- `$PACKAGE/src/private/createConfigCacheMeta.ts` — uses the shared `CONFIG_CACHE_VERSION`.
- `$PACKAGE/src/private/writeConfigBundle.ts` — uses the shared filenames; warns via `console.warn` when the cache is unwritable before degrading to a temp bundle.
- `$PACKAGE/src/private/hashConfigInputs.ts` — delegates to `hashConfigInputPaths` (behaviour unchanged).
- `$PACKAGE/src/index.ts` — exports `findReusableBundle`.
- `$PACKAGE/src/loadConfigModule.test.ts` — esbuild `build` call-through spy plus 10 cache tests (16 total): valid cache skips rebuild; edited source rebuilds and refreshes; imported-file change rebuilds; missing bundle, missing/unparseable/version-mismatch metadata, and missing recorded input all rebuild; unwritable cache degrades to a temp bundle with a warning; `cache: false` bypasses reuse and refreshes stale metadata.

## Blockers (if any)

None.
