import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createGenericOperation } from '../model/createGenericOperation.js';
import { createOperationFailure } from '../model/createOperationFailure.js';
import { createOperationSuccess } from '../model/createOperationSuccess.js';

import { createPipeSeparatedFormatter } from './createPipeSeparatedFormatter.js';

beforeEach(() => {
	vi.spyOn(Date, 'now').mockReturnValue(1_000);
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('createPipeSeparatedFormatter', () => {
	it('WHEN formatting a pending operation, it adds the pending symbol and keeps field order', () => {
		const pending = createGenericOperation('pull', undefined, () => 'from origin/main');
		const formatter = createPipeSeparatedFormatter(operation => [
			operation.operation,
			operation.text(),
		]);

		const text = formatter(pending);

		expect(text).toBe('⏳ | pull | from origin/main |');
	});

	it('WHEN formatting a successful operation, it adds the success symbol and elapsed time', () => {
		const pending = createGenericOperation('pull', undefined, () => 'from origin/main');
		const success = createOperationSuccess(pending);
		const formatter = createPipeSeparatedFormatter(operation => [
			operation.operation,
			operation.text(),
		]);

		const text = formatter(success);

		expect(text).toBe('🟢 | pull | from origin/main | (0ms)');
	});

	it('WHEN formatting a failed operation, it adds the failure symbol and elapsed time', () => {
		const pending = createGenericOperation('pull');
		const failure = createOperationFailure(pending, new Error('remote unavailable'));
		const formatter = createPipeSeparatedFormatter(operation => [
			operation.operation,
			operation.text(),
		]);

		const text = formatter(failure);

		expect(text).toBe('🔴 | pull | remote unavailable | (0ms)');
	});
});
