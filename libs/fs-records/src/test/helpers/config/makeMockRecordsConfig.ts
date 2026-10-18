import type { FSRecordsPattern } from '../../../files/types.js';

export function makeMockRecordsConfig(custom?: Partial<FSRecordsPattern>): FSRecordsPattern[] {
	return [
		{
			base: '.',
			pattern: '*.art',
			ignored: ['node_modules/', '.git/', 'dist/'],
			excluded: [],
			gitignore: true,
			...custom,
		},
	];
}
