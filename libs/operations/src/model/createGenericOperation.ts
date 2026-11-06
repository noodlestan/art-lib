import { LEVELS } from './private/constants.js';
import { readInputUri } from './private/readInputUri.js';
import type { OperationPending } from './types.js';

export function createGenericOperation(name: string, data?: unknown): OperationPending {
	const ts = Date.now();

	function message(): string {
		return readInputUri(data);
	}

	const pending: OperationPending = {
		operation: name,
		ts,
		outcome: 'pending',
		level: LEVELS.pending,
		data,
		message,
		timing(): number {
			return Number.NaN;
		},
		text: message,
	};

	return Object.freeze(pending);
}
