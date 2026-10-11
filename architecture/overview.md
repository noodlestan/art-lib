# Overview: Art Lib

**Purpose:** Introduce Art Lib and its libraries: what frameworks it wraps, what capabilities it provides.

## Framework Wrappers

See Also: [Decisions: Frameworks](./adr/frameworks.md).

**Architectural Boundaries:**

- **Commander** owns command definitions, arguments, options, help output and routing.
- **Clack** owns interactive prompt flows.
- **OpenTUI** owns persistent terminal rendering and UI interaction while mounted.
- **Command workflows** own application behaviour, including long-running processes, file watchers, shutdown and cleanup.

Use one terminal renderer for a given terminal screen at a time. Complete Clack prompt flows before mounting OpenTUI unless terminal ownership is explicitly coordinated.

## Capabilities

### Operations

The shared operation model and append-only operations log: consistent outcome tracking (`pending`/`success`/`failure`) across CLI commands.

Planned package: `@art-lib/operations`

### Logger

Normalized logging of operations and messages with buffering — so operations are logged consistently before and after the environment is fully resolved — wrapping the actual log writer.

Planned package: `@art-lib/logger`

### Config Loading

Load, compile, and cache typed config modules (for example, `something.config.mts`), so every command resolves its configuration through one cached, typed path.

Planned package: `@art-lib/config`

WIP - track progress at:

- `$ART_WORK/cli/work/src/config`
- `$ART_WORK/_backlog/{dir}/plan-add-config-cache/plan.md`
