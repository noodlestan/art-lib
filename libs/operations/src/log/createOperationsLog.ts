import type { LoggerAPI } from '@art-lib/logger';

import type {
	AnyFinishedOperation,
	LoggableOperation,
	OperationsLog,
	OperationsLogOptions,
} from './types.js';

function isFinished(operation: LoggableOperation): operation is AnyFinishedOperation {
	return operation.outcome !== 'pending';
}

export function createOperationsLog(
	logger: LoggerAPI,
	options?: OperationsLogOptions,
): OperationsLog {
	// Reserved for a future iteration: accepted, deliberately not read here.
	// eslint-disable-next-line no-void
	void options;

	const store: AnyFinishedOperation[] = [];

	return {
		log(operation): void {
			logger.log(operation); // every operation is a message: pending and finished alike

			if (isFinished(operation)) {
				store.push(operation); // the store keeps finished operations only
			}
		},
		all(): AnyFinishedOperation[] {
			return [...store]; // a copy — never leak the internal buffer
		},
		since(timestamp: number): AnyFinishedOperation[] {
			return store.filter(operation => operation.ts >= timestamp);
		},
		latest(count: number): AnyFinishedOperation[] {
			if (count <= 0) {
				return [];
			}

			return store.slice(Math.max(store.length - count, 0));
		},
	};
}
