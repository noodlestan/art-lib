import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

export function getGitIgnoredSet(basePath: string, candidates: string[]): Set<string> {
	try {
		const output = execFileSync('git', ['check-ignore', '--no-index', '--stdin'], {
			input: candidates.join('\n'),
			cwd: basePath,
			encoding: 'utf-8',
			timeout: 5000,
			stdio: ['pipe', 'pipe', 'ignore'],
		});
		return new Set(
			output
				.split('\n')
				.filter(Boolean)
				.map((line: string) => resolve(basePath, line)),
		);
	} catch {
		return new Set();
	}
}
