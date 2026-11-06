import type { Message } from '@art-lib/logger';
import { describe, expect, expectTypeOf, it } from 'vitest';

import type { OperationFailure, OperationPending, OperationSuccess } from './types.js';

import { createGenericOperation, createOperationFailure, createOperationSuccess } from './index.js';

describe('createGenericOperation', () => {
	it('WHEN created it returns a pending operation with the derived debug level and no finishedTs', () => {
		const pending = createGenericOperation('clone', { uri: 'repo.art' });

		expect(pending.outcome).toBe('pending');
		expect(pending.level).toBe('debug');
		expect(pending.operation).toBe('clone');
		expect(pending.ts).toBeTypeOf('number');
		expect(pending.finishedTs).toBeUndefined();
		expect(pending.data).toEqual({ uri: 'repo.art' });
	});

	it('WHEN data exposes a uri — message returns the input uri', () => {
		const pending = createGenericOperation('clone', { uri: 'repo.art' });

		expect(pending.message()).toBe('repo.art');
	});

	it('WHEN data carries no uri — message returns an empty string', () => {
		expect(createGenericOperation('clone').message()).toBe('');
		expect(createGenericOperation('clone', { repo: 'repo.art' }).message()).toBe('');
		expect(createGenericOperation('clone', null).message()).toBe('');
		expect(createGenericOperation('clone', { uri: 42 }).message()).toBe('');
	});

	it('WHEN pending — timing is NaN and text aliases message', () => {
		const pending = createGenericOperation('clone', { uri: 'repo.art' });

		expect(Number.isNaN(pending.timing())).toBe(true);
		expect(pending.text()).toBe(pending.message());
	});
});

describe('createOperationSuccess', () => {
	it('WHEN a pending operation finishes it moves to success, setting finishedTs once and never reverting the pending', () => {
		const pending = createGenericOperation('push', { uri: 'repo.art' });
		const success = createOperationSuccess(pending, 'pushed');

		expect(success.outcome).toBe('success');
		expect(success.level).toBe('info');
		expect(typeof success.finishedTs).toBe('number');
		expect(pending.outcome).toBe('pending');
		expect(pending.finishedTs).toBeUndefined();
	});

	it('WHEN finished — timing is finite and equals finishedTs minus ts', () => {
		const pending = createGenericOperation('push', { uri: 'repo.art' });
		const success = createOperationSuccess(pending, 'pushed');

		expect(Number.isFinite(success.timing())).toBe(true);
		expect(success.timing()).toBe(Number(success.finishedTs) - success.ts);
	});

	it('WHEN a message is given it reports it, otherwise it falls back to the pending input uri', () => {
		const pending = createGenericOperation('push', { uri: 'repo.art' });

		expect(createOperationSuccess(pending, 'pushed').message()).toBe('pushed');
		expect(createOperationSuccess(pending).message()).toBe('repo.art');
	});

	it('WHEN finished it copies operation and data from the pending and aliases text with message', () => {
		const pending = createGenericOperation('push', { uri: 'repo.art' });
		const success = createOperationSuccess(pending, 'pushed');

		expect(success.operation).toBe('push');
		expect(success.data).toEqual({ uri: 'repo.art' });
		expect(success.text()).toBe(success.message());
	});
});

describe('createOperationFailure', () => {
	function createPendingOperation(): OperationPending {
		return createGenericOperation('parse', { uri: 'notes.art' });
	}

	it('WHEN a pending operation fails it moves to failure with the derived error level', () => {
		const failure = createOperationFailure(createPendingOperation(), new Error('bad input'));

		expect(failure.outcome).toBe('failure');
		expect(failure.level).toBe('error');
		expect(typeof failure.finishedTs).toBe('number');
		expect(failure.operation).toBe('parse');
		expect(failure.data).toEqual({ uri: 'notes.art' });
	});

	it('WHEN failed it reports the error reason and text aliases it', () => {
		const failure = createOperationFailure(createPendingOperation(), new Error('bad input'));

		expect(failure.message()).toBe('bad input');
		expect(failure.text()).toBe('bad input');
		expect(Number.isFinite(failure.timing())).toBe(true);
	});

	it('WHEN a label is supplied it prefixes it in errorSerialized', () => {
		const failure = createOperationFailure(createPendingOperation(), new Error('bad input'), {
			label: 'ParseError',
		});

		expect(failure.errorSerialized()).toBe('ParseError: bad input');
	});

	it('WHEN no label is supplied it returns the raw error message in errorSerialized', () => {
		const failure = createOperationFailure(createPendingOperation(), new Error('bad input'));

		expect(failure.errorSerialized()).toBe('bad input');
	});

	it('FOR an Error, a string, or an unknown value it serializes the message without throwing', () => {
		const fromError = createOperationFailure(createPendingOperation(), new Error('boom'));
		const fromString = createOperationFailure(createPendingOperation(), 'boom');
		const fromUnknown = createOperationFailure(createPendingOperation(), { message: 'boom' });
		const fromUnconvertible = createOperationFailure(
			createPendingOperation(),
			Object.create(null) as unknown,
		);

		expect(fromError.error).toBe('boom');
		expect(fromString.error).toBe('boom');
		expect(fromUnknown.error).toBe('boom');
		expect(fromUnknown.errorSerialized()).toBe('boom');
		expect(fromUnconvertible.error).toBe('');

		expect(createOperationFailure(createPendingOperation(), 42).error).toBe('42');
		expect(createOperationFailure(createPendingOperation(), { message: 42 }).error).toBe(
			'[object Object]',
		);
		expect(createOperationFailure(createPendingOperation(), null).error).toBe('');
		expect(createOperationFailure(createPendingOperation(), undefined).error).toBe('');
	});
});

describe('immutability', () => {
	it('WHEN created every operation is frozen — records expose no mutating setters', () => {
		const pending = createGenericOperation('clone', { uri: 'repo.art' });
		const success = createOperationSuccess(pending, 'cloned');
		const failure = createOperationFailure(pending, new Error('boom'), { label: 'CloneError' });

		expect(Object.isFrozen(pending)).toBe(true);
		expect(Object.isFrozen(success)).toBe(true);
		expect(Object.isFrozen(failure)).toBe(true);
		expect(() => {
			(success as { outcome: string }).outcome = 'failure';
		}).toThrow(TypeError);
		expect(success.outcome).toBe('success');
	});
});

describe('Message conformance', () => {
	it('FOR every operation shape it assigns to Message of @art-lib/logger', () => {
		expectTypeOf<OperationPending>().toMatchTypeOf<Message>();
		expectTypeOf<OperationSuccess>().toMatchTypeOf<Message>();
		expectTypeOf<OperationFailure>().toMatchTypeOf<Message>();
	});
});
