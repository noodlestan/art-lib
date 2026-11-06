import { LEVELS } from './private/constants.js';
import type { OperationPending, OperationSuccess } from './types.js';

export function createOperationSuccess(
	pending: OperationPending,
	message?: string,
): OperationSuccess {
	const finishedTs = Date.now();
	const givenText = message ?? pending.message();

	function report(): string {
		return givenText;
	}

	const success: OperationSuccess = {
		operation: pending.operation,
		ts: pending.ts,
		finishedTs,
		outcome: 'success',
		level: LEVELS.success,
		data: pending.data,
		message: report,
		timing(): number {
			return finishedTs - pending.ts;
		},
		text: report,
	};

	return Object.freeze(success);
}
