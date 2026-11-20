import { describe, expect, expectTypeOf, it } from 'vitest';

import { createGenericOperation } from './createGenericOperation.js';
import { createOperationSuccess } from './createOperationSuccess.js';
import type { OperationSuccess } from './types.js';

describe('createOperationSuccess', () => {
	it('WHEN a pending operation succeeds, it sets the success outcome and finish time', () => {
		const pending = createGenericOperation('push', { uri: 'repo.art' });

		const success = createOperationSuccess(pending);

		expect(success.outcome).toBe('success');
		expect(success.finishedTs).toBeTypeOf('number');
		expect(pending.outcome).toBe('pending');
		expect(pending.finishedTs).toBeUndefined();
	});

	it('WHEN no success text is supplied, it uses the pending operation text', () => {
		const pending = createGenericOperation('push', { uri: 'repo.art' });

		const success = createOperationSuccess(pending);

		expect(success.text()).toBe('{"uri":"repo.art"}');
	});

	it('WHEN success text is supplied, it uses that text', () => {
		const pending = createGenericOperation('push', { uri: 'repo.art' });

		const success = createOperationSuccess(pending, 'pushed');

		expect(success.text()).toBe('pushed');
	});

	it('WHEN a pending operation succeeds, timing is finish time minus start time', () => {
		const pending = createGenericOperation('push');

		const success = createOperationSuccess(pending);

		expect(success.timing()).toBe(Number(success.finishedTs) - pending.ts);
	});

	it('WHEN a pending operation succeeds, it preserves its operation name and typed data', () => {
		const data = { checkout: 'art-lib' };
		const pending = createGenericOperation('pull', data);

		const success = createOperationSuccess(pending);

		expect(success.operation).toBe('pull');
		expect(success.data).toEqual(data);
		expectTypeOf(success.data).toEqualTypeOf<typeof data | undefined>();
		expectTypeOf(success).toMatchTypeOf<OperationSuccess<typeof data>>();
	});

	it('WHEN a pending operation succeeds, the success state is frozen', () => {
		const pending = createGenericOperation('push');

		const success = createOperationSuccess(pending);

		expect(Object.isFrozen(success)).toBe(true);
	});
});
