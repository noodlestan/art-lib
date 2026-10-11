# Art Lib - Frameworks

## Decision: CLI Framework — Commander

**Status:** Adopted

**Context:** The CLI has several commands with various per-command and shared options. Need a framework that handles subcommands well without being overkill.

**Decision:** Use `commander` as the CLI framework. It's lightweight, widely used, and handles subcommands effectively. Alternatives considered: `yargs` (heavier, not much more capable for this scope), `oclif` (overkill for 5 commands), custom parser (unnecessary work).

- [Commander code](https://github.com/tj/commander.js)
- [Commander docs](https://raw.githubusercontent.com/tj/commander.js/refs/heads/master/Readme.md)

**Consequences:** Standard CLI argument parsing, help generation, and subcommand routing. Well-documented, widely understood. Minimal dependency footprint.

## Decision: Interactive Prompts — Clack

**Status:** Adopted

**Context:** Some commands need to ask users questions interactively, such as collecting configuration during initialization. Prompting should be separate from command parsing and routing.

**Decision:** Use `@clack/prompts` for interactive questions and selections. Keep prompts inside command workflows rather than embedding interaction into Commander definitions.

**Consequences:** Commands can collect user input through a dedicated prompt API while Commander remains responsible for parsing and routing. Prompt interactions should complete before starting a persistent terminal UI on the same terminal.

- [Clack Prompts – source](https://github.com/bombshell-dev/clack/tree/main/packages/prompts)
- [Clack Prompts – demo](https://stackblitz.com/edit/clack-prompts?file=index.js)

## Decision: Persistent Terminal UI — OpenTUI

**Status:** Adopted

**Context:** Some tools need a persistent, dynamically updated terminal interface for long-running work such as development servers and file watchers. The UI should be composable and fit Art Lib's TypeScript and Solid-based code.

**Decision:** Use OpenTUI as the terminal UI framework, with its [SolidJS](https://www.solidjs.com) renderer. OpenTUI provides a rendering core with React and Solid integrations and is used by OpenCode. Treat OpenTUI as the terminal renderer for a running UI session; do not concurrently run another renderer such as neo-blessed against the same terminal.

- [OpenCode – source](https://github.com/anomalyco/opencode)
- [OpenTUI – source](https://github.com/anomalyco/opentui)

**Consequences:** Persistent interfaces can be composed from Solid components and updated from application state. Process and watcher lifecycles remain separate from UI rendering and must be managed explicitly. Before relying on OpenTUI in published Node-based tools, validate its runtime requirements, packaging and distribution compatibility; its native implementation and development tooling may impose constraints.
