import type { OperationSuccess } from '../../../model/types.js';

import type { OperationFixtureData } from './types.js';

export function makeSuccessOperationFixture(
	ts = 1_000,
	finishedTs = 1_050,
): OperationSuccess<OperationFixtureData> {
	return {
		operation: 'pull',
		ts,
		finishedTs,
		outcome: 'success',
		data: { branch: 'main' },
		text: () => 'from origin/main',
		timing: () => finishedTs - ts,
	};
}
