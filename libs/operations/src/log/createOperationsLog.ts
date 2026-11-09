import { isFinished } from './private/isFinished.js';
import type {
	AnyFinishedOperation,
	LoggerInterface,
	OperationsLog,
	OperationsLogOptions,
} from './types.js';

export function createOperationsLog(
	logger: LoggerInterface,
	options?: OperationsLogOptions,
): OperationsLog {
	// Reserved for a future iteration: accepted, deliberately not read here.
	// eslint-disable-next-line no-void
	void options;

	const storedOperations: AnyFinishedOperation[] = [];

	return {
		log(operation): void {
			logger.log(operation); // every operation is a message: pending and finished alike

			if (isFinished(operation)) {
				storedOperations.push(operation); // finished operations only
			}
		},
		all(): AnyFinishedOperation[] {
			return [...storedOperations]; // a copy — never leak the internal buffer
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
