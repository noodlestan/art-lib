import { describe, expect, it } from 'vitest';

import { createGenericOperation } from '../../model/createGenericOperation.js';
import { createOperationFailure } from '../../model/createOperationFailure.js';
import { createOperationSuccess } from '../../model/createOperationSuccess.js';

import { isFinished } from './isFinished.js';

describe('isFinished', () => {
	it('WHEN an operation is pending, it returns false', () => {
		const pending = createGenericOperation('pull');

		const finished = isFinished(pending);

		expect(finished).toBe(false);
	});

	it('WHEN an operation succeeds, it returns true', () => {
		const pending = createGenericOperation('pull');
		const success = createOperationSuccess(pending);

		const finished = isFinished(success);

		expect(finished).toBe(true);
	});

	it('WHEN an operation fails, it returns true', () => {
		const pending = createGenericOperation('pull');
		const failure = createOperationFailure(pending, new Error('remote unavailable'));

		const finished = isFinished(failure);

		expect(finished).toBe(true);
	});
});
