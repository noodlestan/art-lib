import type { OperationBase } from '../model/index.js';

import { OUTCOME_SYMBOLS } from './private/constants.js';
import type { OperationFormatter } from './types.js';

export function createPipeSeparatedFormatter<TOperation extends OperationBase = OperationBase>(
	getFields: (operation: TOperation) => readonly string[],
): OperationFormatter<TOperation> {
	return operation => {
		const fields = [OUTCOME_SYMBOLS[operation.outcome], ...getFields(operation)];
		const line = `${fields.join(' | ')} |`;

		if (operation.outcome === 'pending') {
			return line;
		}

		return `${line} (${operation.timing()}ms)`;
	};
}
