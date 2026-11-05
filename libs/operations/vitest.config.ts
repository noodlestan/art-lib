import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
		passWithNoTests: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'text-summary'],
			exclude: ['src/index.ts'],
			thresholds: {
				lines: 90,
				functions: 90,
				branches: 70,
				statements: 90,
			},
		},
	},
});
