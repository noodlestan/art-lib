import { builtinModules } from 'node:module';

const nodeBuiltins = builtinModules.flatMap(builtin =>
	builtin.startsWith('node:') ? [builtin] : [builtin, `node:${builtin}`],
);

const DEFAULT_EXTERNALS = ['esbuild', ...nodeBuiltins];

export function getConfigExternals(externals: string[] = []): string[] {
	return [...DEFAULT_EXTERNALS, ...externals];
}
