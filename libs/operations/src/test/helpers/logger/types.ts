import type { Message } from '@art-lib/logger';

import type { LoggerInterface } from '../../../log/types.js';

export type LoggerMock = {
	logger: LoggerInterface;
	messages: Message[];
};
