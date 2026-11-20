import { readRawErrorMessage } from './private/readRawErrorMessage.js';
import type { OperationFailure, OperationPending } from './types.js';

export function createOperationFailure<D>(
	pending: OperationPending<D>,
	error: unknown,
): OperationFailure<D> {
	const finishedTs = Date.now();
	const rawError = readRawErrorMessage(error);

	function report(): string {
		return rawError;
	}

	const failure: OperationFailure<D> = {
		operation: pending.operation,
		ts: pending.ts,
		finishedTs,
		outcome: 'failure',
		data: pending.data,
		error: rawError,
		text: report,
		timing(): number {
			return finishedTs - pending.ts;
		},
	};

	return Object.freeze(failure);
}
