import type { LoggableOperation, LoggerInterface } from '../../../log/types.js';

import type { LoggerMock } from './types.js';

/** @mocks the logger the operations log forwards to */
export function createLoggerMock(): LoggerMock {
	const messages: LoggableOperation[] = [];

	const logger: LoggerInterface = {
		log(operation): void {
			messages.push(operation);
		},
	};

	return { logger, messages };
}
