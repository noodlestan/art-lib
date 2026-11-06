import type { Message } from '@art-lib/logger';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	createGenericOperation,
	createOperationFailure,
	createOperationSuccess,
} from '../model/index.js';
import { createLoggerMock } from '../test/helpers/logger/createLoggerMock.js';

import { createOperationsLog } from './createOperationsLog.js';
import type { OperationsLog } from './types.js';

type LogHarness = {
	log: OperationsLog;
	messages: Message[];
};

describe('createOperationsLog', () => {
	let now = 0;

	beforeEach(() => {
		now = 1_000;
		vi.spyOn(Date, 'now').mockImplementation(() => now);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	function createLog(): LogHarness {
		const { logger, messages } = createLoggerMock();

		return { log: createOperationsLog(logger), messages };
	}

	it('FOR pending and finished operations it forwards them to the logger', () => {
		const { log, messages } = createLog();
		const pending = createGenericOperation('clone', { uri: 'repo.art' });
		const success = createOperationSuccess(pending, 'cloned');
		const failure = createOperationFailure(pending, new Error('boom'), { label: 'CloneError' });

		log.log(pending);
		log.log(success);
		log.log(failure);

		expect(messages).toHaveLength(3);
		expect(messages[0]).toBe(pending);
		expect(messages[1]).toBe(success);
		expect(messages[2]).toBe(failure);
	});

	it('FOR a pending operation it never stores it — queries return only finished ones', () => {
		const { log } = createLog();
		const pending = createGenericOperation('clone', { uri: 'repo.art' });

		log.log(pending);

		expect(log.all()).toEqual([]);
		expect(log.since(0)).toEqual([]);
		expect(log.latest(10)).toEqual([]);

		const failure = createOperationFailure(pending, new Error('boom'));

		log.log(failure);

		expect(log.all()).toEqual([failure]);
		expect(log.since(0)).toEqual([failure]);
		expect(log.latest(1)).toEqual([failure]);
	});

	it('FOR all() it returns a copy in arrival order — mutating it does not affect the store', () => {
		const { log } = createLog();
		const first = createOperationSuccess(createGenericOperation('clone', { uri: 'a.art' }));
		const second = createOperationSuccess(createGenericOperation('push', { uri: 'b.art' }));

		log.log(first);
		log.log(second);

		const allOperations = log.all();

		expect(allOperations).toEqual([first, second]);
		expect(allOperations).not.toBe(log.all());

		allOperations.pop();

		expect(log.all()).toEqual([first, second]);
	});

	it('FOR a timestamp it filters finished operations with ts >= timestamp', () => {
		const { log } = createLog();

		const early = createOperationSuccess(createGenericOperation('clone', { uri: 'a.art' }));
		now = 2_000;
		const mid = createOperationSuccess(createGenericOperation('clone', { uri: 'b.art' }));
		now = 3_000;
		const late = createOperationFailure(createGenericOperation('push'), new Error('boom'));

		log.log(early);
		log.log(mid);
		log.log(late);

		expect(log.since(1_000)).toEqual([early, mid, late]);
		expect(log.since(2_000)).toEqual([mid, late]);
		expect(log.since(3_000)).toEqual([late]);
		expect(log.since(4_000)).toEqual([]);
	});

	it('FOR a count it returns the last n finished operations in arrival order', () => {
		const { log } = createLog();
		const first = createOperationSuccess(createGenericOperation('clone'));
		const second = createOperationSuccess(createGenericOperation('push'));
		const third = createOperationFailure(createGenericOperation('parse'), new Error('boom'));

		log.log(first);
		log.log(second);
		log.log(third);

		expect(log.latest(1)).toEqual([third]);
		expect(log.latest(2)).toEqual([second, third]);
		expect(log.latest(5)).toEqual([first, second, third]);
		expect(log.latest(0)).toEqual([]);
		expect(log.latest(-3)).toEqual([]);
	});
});
