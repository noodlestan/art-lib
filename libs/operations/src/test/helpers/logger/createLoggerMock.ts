import type { Message } from '@art-lib/logger';

import type { LoggerInterface } from '../../../log/types.js';

import type { LoggerMock } from './types.js';

/** @mocks the logger the operations log forwards to */
export function createLoggerMock(): LoggerMock {
	const messages: Message[] = [];

	const logger: LoggerInterface = {
		log(operation): void {
			messages.push(operation);
		},
	};

	return { logger, messages };
}
