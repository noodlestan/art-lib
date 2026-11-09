import { LEVELS } from './private/constants.js';
import { formatData } from './private/formatData.js';
import type { OperationPending } from './types.js';

export function createGenericOperation<N extends string, D = unknown>(
	name: N,
	data?: D,
	toText?: (data: D) => string,
): OperationPending<D> & { operation: N } {
	const ts = Date.now();
	const resolveToText: (value: D) => string = toText ?? formatData;

	function readText(): string {
		return resolveToText(data as D);
	}

	const pending: OperationPending<D> = {
		operation: name,
		ts,
		outcome: 'pending',
		level: LEVELS.pending,
		data,
		text: readText,
		timing(): number {
			return Number.NaN;
		},
	};

	return Object.freeze(pending) as OperationPending<D> & { operation: N };
}
