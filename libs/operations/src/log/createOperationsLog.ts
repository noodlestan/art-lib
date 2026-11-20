import type { LoggerAPI } from '@art-lib/logger';

import type { OperationBase } from '../model/index.js';

import { OUTCOME_LEVELS } from './private/constants.js';
import { isFinished } from './private/isFinished.js';
import type { AnyFinishedOperation, OperationsLog, OperationsLogOptions } from './types.js';

export function createOperationsLog<TOperation extends OperationBase = OperationBase>(
	logger: LoggerAPI,
	options: OperationsLogOptions<TOperation>,
): OperationsLog<TOperation> {
	const storedOperations: AnyFinishedOperation[] = [];

	return {
		log(operation): void {
			const message = {
				level: OUTCOME_LEVELS[operation.outcome],
				text: options.formatter(operation),
				ts: operation.ts,
			};

			logger.log(message);

			if (isFinished(operation)) {
				storedOperations.push(operation);
			}
		},
		all(): AnyFinishedOperation[] {
			return [...storedOperations];
		},
		since(timestamp: number): AnyFinishedOperation[] {
			return storedOperations.filter(operation => operation.ts >= timestamp);
		},
		latest(count: number): AnyFinishedOperation[] {
			if (count <= 0) {
				return [];
			}

			return storedOperations.slice(Math.max(storedOperations.length - count, 0));
		},
	};
}
