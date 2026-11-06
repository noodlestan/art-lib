import type { LoggerAPI, Message } from '@art-lib/logger';

export type LoggerMock = {
	logger: LoggerAPI;
	messages: Message[];
};
