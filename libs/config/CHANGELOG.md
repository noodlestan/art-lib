# CHANGELOG

## 0.0.1

### Added

- **loadConfigModule():** Load a typed config module from a caller-supplied entry path — reuse the cached bundle while its sources are unchanged, compile with esbuild bundle-at-runtime otherwise, then import. Accepts `(entryPath, options?)`.

- **compileConfig():** esbuild bundle-at-runtime compilation with the package's default externals (node builtins and `esbuild`) merged over caller `externals`; writes the bundle and cache metadata to `cacheDir`, degrading to a temp bundle when the cache is unwritable.

- **importConfigModule():** Dynamic import of a compiled bundle; returns its default export.

- **findReusableBundle():** Content-hash cache reuse check — version-guarded and shape-guarded metadata, bundle presence, and sha256 verification of every recorded input.

- **Types:** `LoadConfigOptions`, `CompiledConfig`, `ConfigCacheInput`, `ConfigCacheMeta`.
