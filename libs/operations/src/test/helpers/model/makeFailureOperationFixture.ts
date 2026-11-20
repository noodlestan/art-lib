import type { OperationFailure } from '../../../model/types.js';

import type { OperationFixtureData } from './types.js';

export function makeFailureOperationFixture(
	ts = 1_000,
	finishedTs = 1_075,
): OperationFailure<OperationFixtureData> {
	return {
		operation: 'pull',
		ts,
		finishedTs,
		outcome: 'failure',
		data: { branch: 'main' },
		error: 'remote unavailable',
		text: () => 'remote unavailable',
		timing: () => finishedTs - ts,
	};
}
