import { describe, expect, expectTypeOf, it } from 'vitest';

import { createGenericOperation } from './createGenericOperation.js';
import type { OperationPending } from './types.js';

describe('createGenericOperation', () => {
	it('WHEN a generic operation is created, it is pending with its name and start timestamp', () => {
		const data = { uri: 'repo.art' };

		const pending = createGenericOperation('clone', data);

		expect(pending.outcome).toBe('pending');
		expect(pending.operation).toBe('clone');
		expect(pending.ts).toBeTypeOf('number');
		expect(pending.finishedTs).toBeUndefined();
		expect(pending.data).toEqual(data);
		expectTypeOf(pending.operation).toEqualTypeOf<'clone'>();
	});

	it('WHEN data is given without a text function, it serialises the data as JSON', () => {
		const data = { uri: 'repo.art' };

		const pending = createGenericOperation('clone', data);

		expect(pending.text()).toBe('{"uri":"repo.art"}');
	});

	it('WHEN a text function is supplied, it provides the operation text', () => {
		const data = { checkout: 'art-lib' };
		const toText = (value: typeof data) => {
			return `from ${value.checkout}`;
		};

		const pending = createGenericOperation('pull', data, toText);

		expect(pending.text()).toBe('from art-lib');
	});

	it('WHEN an operation is pending, its timing is NaN', () => {
		const pending = createGenericOperation('clone');

		expect(Number.isNaN(pending.timing())).toBe(true);
	});

	it('WHEN a generic operation is created, its data and text remain separate from logger messages', () => {
		const data = { uri: 'repo.art' };

		const pending = createGenericOperation('clone', data);

		expect('level' in pending).toBe(false);
		expect(typeof pending.text).toBe('function');
	});

	it('WHEN a CLI factory specialises the generic factory, it returns its typed pending operation', () => {
		type PullData = { branch: string };
		type PullPending = OperationPending<PullData> & { operation: 'pull' };

		function createPullOperation(branch: string): PullPending {
			const data = { branch };
			const toText = () => `from origin/${branch}`;

			return createGenericOperation('pull', data, toText);
		}

		const pending = createPullOperation('main');

		expect(pending.operation).toBe('pull');
		expect(pending.text()).toBe('from origin/main');
	});

	it('WHEN a generic operation is created, it is frozen', () => {
		const pending = createGenericOperation('clone');

		expect(Object.isFrozen(pending)).toBe(true);
	});
});
