import type { RecordsConfig } from '../types';

export function makeMockRecordsConfig(custom?: Partial<RecordsConfig>): RecordsConfig {
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
