import type { Message } from '@art-lib/logger';

import type { OperationBase, OperationFailure, OperationSuccess } from '../model/index.js';

export type AnyFinishedOperation = OperationSuccess | OperationFailure;

export type OperationsLog = {
	log(operation: OperationBase): void;
	all(): AnyFinishedOperation[];
	since(timestamp: number): AnyFinishedOperation[];
	latest(count: number): AnyFinishedOperation[];
};

export type LoggerInterface = {
	log(operation: Message): void;
};

export type OperationsLogOptions = unknown; // reserved; ignored in this iteration
