import { describe, expect, it } from 'vitest';

import { makeFailureOperationFixture } from './makeFailureOperationFixture.js';
import { makePendingOperationFixture } from './makePendingOperationFixture.js';
import { makeSuccessOperationFixture } from './makeSuccessOperationFixture.js';

describe('operation fixtures', () => {
	it('WHEN fixture timestamps are supplied, timing reflects the operation outcome', () => {
		expect(makePendingOperationFixture(1_000).timing()).toBeNaN();
		expect(makeSuccessOperationFixture(1_000, 1_050).timing()).toBe(50);
		expect(makeFailureOperationFixture(1_000, 1_075).timing()).toBe(75);
	});
});
