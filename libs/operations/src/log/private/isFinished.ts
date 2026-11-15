import type { OperationBase } from '../../model/types.js';
import type { AnyFinishedOperation } from '../types.js';

export function isFinished(operation: OperationBase): operation is AnyFinishedOperation {
	return operation.outcome !== 'pending';
}
