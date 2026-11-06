import type { LoggerAPI, Message } from '@art-lib/logger';

import type { LoggerMock } from './types.js';

/** @mocks LoggerAPI */
export function createLoggerMock(): LoggerMock {
	const messages: Message[] = [];

	const logger: LoggerAPI = {
		log(message): void {
			messages.push(message);
		},
		setOutputMode(): void {
			// no-op: tests never switch the output mode
		},
	};

	return { logger, messages };
}
