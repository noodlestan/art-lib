import type { LoggerAPI, Message } from '@art-lib/logger';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	createGenericOperation,
	createOperationFailure,
	createOperationSuccess,
} from '../model/index.js';

import { createOperationsLog } from './createOperationsLog.js';
import type { OperationsLog } from './types.js';

function createSpyLogger(): { logger: LoggerAPI; logged: Message[] } {
	const logged: Message[] = [];
	const logger: LoggerAPI = {
		log: message => {
			logged.push(message);
		},
		setOutputMode: () => undefined,
	};

	return { logger, logged };
}

describe('createOperationsLog', () => {
	let now = 0;

	beforeEach(() => {
		now = 1_000;
		vi.spyOn(Date, 'now').mockImplementation(() => now);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	function createLog(): { log: OperationsLog; logged: Message[] } {
		const { logger, logged } = createSpyLogger();

		return { log: createOperationsLog(logger), logged };
	}

	it('forwards pending AND finished operations to the logger', () => {
		const { log, logged } = createLog();
		const pending = createGenericOperation('clone', { uri: 'repo.art' });
		const success = createOperationSuccess(pending, 'cloned');
		const failure = createOperationFailure(pending, new Error('boom'), { label: 'CloneError' });

		log.log(pending);
		log.log(success);
		log.log(failure);

		expect(logged).toHaveLength(3);
		expect(logged[0]).toBe(pending);
		expect(logged[1]).toBe(success);
		expect(logged[2]).toBe(failure);
	});

	it('never stores a pending operation — all/since/latest return only finished ones', () => {
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

	it('all() returns a copy in arrival order; mutating it does not affect the store', () => {
		const { log } = createLog();
		const first = createOperationSuccess(createGenericOperation('clone', { uri: 'a.art' }));
		const second = createOperationSuccess(createGenericOperation('push', { uri: 'b.art' }));

		log.log(first);
		log.log(second);

		const all = log.all();

		expect(all).toEqual([first, second]);
		expect(all).not.toBe(log.all());

		all.pop();

		expect(log.all()).toEqual([first, second]);
	});

	it('since(timestamp) filters finished operations with ts >= timestamp', () => {
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

	it('latest(count) returns the last n finished operations in arrival order', () => {
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
