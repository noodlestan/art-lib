import { LEVELS } from './private/constants.js';
import type { OperationPending, OperationSuccess } from './types.js';

export function createOperationSuccess<D>(
	pending: OperationPending<D>,
	text?: string,
): OperationSuccess<D> {
	const finishedTs = Date.now();
	const givenText = text ?? pending.text();

	function report(): string {
		return givenText;
	}

	const success: OperationSuccess<D> = {
		operation: pending.operation,
		ts: pending.ts,
		finishedTs,
		outcome: 'success',
		level: LEVELS.success,
		data: pending.data,
		text: report,
		timing(): number {
			return finishedTs - pending.ts;
		},
	};

	return Object.freeze(success);
}
