import type { AnyFinishedOperation, LoggableOperation } from '../types.js';

export function isFinished(operation: LoggableOperation): operation is AnyFinishedOperation {
	return operation.outcome !== 'pending';
}
