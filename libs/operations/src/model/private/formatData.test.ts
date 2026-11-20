import { describe, expect, it } from 'vitest';

import { formatData } from './formatData.js';

describe('formatData', () => {
	it('WHEN data is provided, it returns its JSON representation', () => {
		const data = { checkout: 'art-lib' };

		const text = formatData(data);

		expect(text).toBe('{"checkout":"art-lib"}');
	});

	it('WHEN data is undefined, it returns an empty string', () => {
		const text = formatData(undefined);

		expect(text).toBe('');
	});

	it('WHEN data is null, it returns an empty string', () => {
		const text = formatData(null);

		expect(text).toBe('');
	});
});
