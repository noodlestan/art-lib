import { createLoggerMock } from '@art-lib/logger/test/helpers/logger/createLoggerMock';
import { describe, expect, it } from 'vitest';

import { makeFailureOperationFixture } from '../test/helpers/model/makeFailureOperationFixture.js';
import { makePendingOperationFixture } from '../test/helpers/model/makePendingOperationFixture.js';
import { makeSuccessOperationFixture } from '../test/helpers/model/makeSuccessOperationFixture.js';

import { createOperationsLog } from './createOperationsLog.js';

describe('createOperationsLog', () => {
	it('WHEN a pending operation is logged, it forwards a debug message and keeps no history', () => {
		const logger = createLoggerMock();
		const operations = createOperationsLog(logger, { formatter: operation => operation.text() });
		const pending = makePendingOperationFixture();

		operations.log(pending);

		expect(logger.log).toHaveBeenCalledExactlyOnceWith({
			level: 'debug',
			text: 'from origin/main',
			ts: pending.ts,
		});
		expect(operations.all()).toEqual([]);
	});

	it('WHEN a success is logged, it forwards an info message and retains the completion', () => {
		const logger = createLoggerMock();
		const operations = createOperationsLog(logger, { formatter: operation => operation.text() });
		const success = makeSuccessOperationFixture();

		operations.log(success);

		expect(logger.log).toHaveBeenCalledExactlyOnceWith({
			level: 'info',
			text: 'from origin/main',
			ts: success.ts,
		});
		expect(operations.all()).toEqual([success]);
	});

	it('WHEN a failure is logged, it forwards an error message and retains the completion', () => {
		const logger = createLoggerMock();
		const operations = createOperationsLog(logger, { formatter: operation => operation.text() });
		const failure = makeFailureOperationFixture();

		operations.log(failure);

		expect(logger.log).toHaveBeenCalledExactlyOnceWith({
			level: 'error',
			text: 'remote unavailable',
			ts: failure.ts,
		});
		expect(operations.all()).toEqual([failure]);
	});

	it('WHEN a formatter is injected, it supplies the logger message text', () => {
		const logger = createLoggerMock();
		const operations = createOperationsLog(logger, {
			formatter: operation => `Operation: ${operation.text()}`,
		});
		const pending = makePendingOperationFixture();

		operations.log(pending);

		expect(logger.log).toHaveBeenCalledExactlyOnceWith({
			level: 'debug',
			text: 'Operation: from origin/main',
			ts: pending.ts,
		});
	});

	it('WHEN completed operations are queried, it returns them in arrival order', () => {
		const logger = createLoggerMock();
		const operations = createOperationsLog(logger, { formatter: operation => operation.text() });
		const success = makeSuccessOperationFixture();
		const failure = makeFailureOperationFixture();

		operations.log(success);
		operations.log(failure);

		expect(operations.all()).toEqual([success, failure]);
	});

	it('WHEN the history is returned, it is a copy of the stored operations', () => {
		const logger = createLoggerMock();
		const operations = createOperationsLog(logger, { formatter: operation => operation.text() });
		const success = makeSuccessOperationFixture();

		operations.log(success);

		const firstRead = operations.all();
		const secondRead = operations.all();

		expect(firstRead).not.toBe(secondRead);
		expect(firstRead).toEqual([success]);
		expect(secondRead).toEqual([success]);
	});

	it('WHEN since is given a timestamp, it includes operations at that timestamp and later', () => {
		const logger = createLoggerMock();
		const operations = createOperationsLog(logger, { formatter: operation => operation.text() });
		const early = makeSuccessOperationFixture(1_000, 1_010);
		const boundary = makeFailureOperationFixture(2_000, 2_010);

		operations.log(early);
		operations.log(boundary);

		expect(operations.since(2_000)).toEqual([boundary]);
	});

	it('WHEN latest is given a positive count, it returns the last matching operations', () => {
		const logger = createLoggerMock();
		const operations = createOperationsLog(logger, { formatter: operation => operation.text() });
		const first = makeSuccessOperationFixture();
		const second = makeFailureOperationFixture();

		operations.log(first);
		operations.log(second);

		expect(operations.latest(1)).toEqual([second]);
	});

	it('WHEN latest is given zero, it returns an empty list', () => {
		const logger = createLoggerMock();
		const operations = createOperationsLog(logger, { formatter: operation => operation.text() });
		const success = makeSuccessOperationFixture();

		operations.log(success);

		expect(operations.latest(0)).toEqual([]);
	});

	it('WHEN latest is given a negative count, it returns an empty list', () => {
		const logger = createLoggerMock();
		const operations = createOperationsLog(logger, { formatter: operation => operation.text() });
		const success = makeSuccessOperationFixture();

		operations.log(success);

		expect(operations.latest(-1)).toEqual([]);
	});
});
