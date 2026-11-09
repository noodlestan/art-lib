import type { LoggableOperation, LoggerInterface } from '../../../log/types.js';

export type LoggerMock = {
	logger: LoggerInterface;
	messages: LoggableOperation[];
};
