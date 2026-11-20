import { describe, expect, expectTypeOf, it } from 'vitest';

import { createGenericOperation } from './createGenericOperation.js';
import { createOperationFailure } from './createOperationFailure.js';
import type { OperationFailure } from './types.js';

describe('createOperationFailure', () => {
	it('WHEN an Error fails an operation, it records the failure and its message', () => {
		const pending = createGenericOperation('parse', { uri: 'notes.art' });

		const failure = createOperationFailure(pending, new Error('bad input'));

		expect(failure.outcome).toBe('failure');
		expect(failure.error).toBe('bad input');
		expect(failure.text()).toBe('bad input');
	});

	it('WHEN an operation fails, it preserves the operation name and typed data', () => {
		const data = { checkout: 'art-lib' };
		const pending = createGenericOperation('pull', data);

		const failure = createOperationFailure(pending, new Error('remote unavailable'));

		expect(failure.operation).toBe('pull');
		expect(failure.data).toEqual(data);
		expectTypeOf(failure).toMatchTypeOf<OperationFailure<typeof data>>();
	});

	it('WHEN an operation fails, it records its finish time and leaves pending unchanged', () => {
		const pending = createGenericOperation('parse', { uri: 'notes.art' });

		const failure = createOperationFailure(pending, new Error('bad input'));

		expect(failure.finishedTs).toBeTypeOf('number');
		expect(failure.timing()).toBe(Number(failure.finishedTs) - failure.ts);
		expect(pending.outcome).toBe('pending');
		expect(pending.finishedTs).toBeUndefined();
	});

	it('WHEN a string is supplied as the error, it uses that string', () => {
		const pending = createGenericOperation('parse');

		const failure = createOperationFailure(pending, 'error string');

		expect(failure.error).toBe('error string');
	});

	it('WHEN an operation fails, it freezes the failure state', () => {
		const pending = createGenericOperation('parse');

		const failure = createOperationFailure(pending, new Error('bad input'));

		expect(Object.isFrozen(failure)).toBe(true);
	});
});
