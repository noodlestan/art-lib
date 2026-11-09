import type { Message } from '@art-lib/logger';

import type { OperationFailure, OperationSuccess } from '../model/index.js';

export type AnyFinishedOperation = OperationSuccess | OperationFailure;

export type LoggableOperation = Message & { outcome: string };

export type OperationsLog = {
	log(operation: LoggableOperation): void;
	all(): AnyFinishedOperation[];
	since(timestamp: number): AnyFinishedOperation[];
	latest(count: number): AnyFinishedOperation[];
};

export type LoggerInterface = {
	log(operation: LoggableOperation): void;
};

export type OperationsLogOptions = unknown; // reserved; ignored in this iteration
