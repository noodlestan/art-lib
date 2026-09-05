import type { FSRecordsConfig } from '../types';

export function makeMockRecordsConfig(custom?: Partial<FSRecordsConfig>): FSRecordsConfig {
	return {
		paths: [
			{
				base: '.',
				pattern: '*.art',
				ignored: ['node_modules/', '.git/', 'dist/'],
				excluded: [],
				gitignore: true,
			},
		],
		...custom,
	};
}
