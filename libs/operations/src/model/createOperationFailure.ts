import { LEVELS } from './private/constants.js';
import { readRawErrorMessage } from './private/readRawErrorMessage.js';
import type { OperationFailure, OperationPending } from './types.js';

export function createOperationFailure<D>(
	pending: OperationPending<D>,
	error: unknown,
	options?: { label?: string },
): OperationFailure<D> {
	const finishedTs = Date.now();
	const rawError = readRawErrorMessage(error);
	const label = options?.label;

	function report(): string {
		return rawError;
	}

	function errorSerialized(): string {
		return label ? `${label}: ${rawError}` : rawError;
	}

	const failure: OperationFailure<D> = {
		operation: pending.operation,
		ts: pending.ts,
		finishedTs,
		outcome: 'failure',
		level: LEVELS.failure,
		data: pending.data,
		error: rawError,
		text: report,
		timing(): number {
			return finishedTs - pending.ts;
		},
		errorSerialized,
	};

	return Object.freeze(failure);
}
