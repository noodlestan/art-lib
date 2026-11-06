import type { Message } from '@art-lib/logger';

import type { OperationFailure, OperationSuccess } from '../model/types.js';

export type AnyFinishedOperation = OperationSuccess | OperationFailure;

/**
 * Any operation with an `outcome` that also satisfies `Message` of `@art-lib/logger`.
 * Pending operations keep forwarding to the logger; finished-only storage is
 * enforced at runtime by `createOperationsLog`.
 */
export type LoggableOperation = Message & { outcome: string };

export interface OperationsLog {
	log(operation: LoggableOperation): void;
	all(): AnyFinishedOperation[];
	since(timestamp: number): AnyFinishedOperation[];
	latest(count: number): AnyFinishedOperation[];
}

export type OperationsLogOptions = unknown; // reserved; ignored in this iteration
