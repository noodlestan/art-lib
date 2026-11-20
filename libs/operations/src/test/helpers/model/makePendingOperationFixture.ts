import type { OperationPending } from '../../../model/types.js';

import type { OperationFixtureData } from './types.js';

export function makePendingOperationFixture(ts = 1_000): OperationPending<OperationFixtureData> {
	return {
		operation: 'pull',
		ts,
		outcome: 'pending',
		data: { branch: 'main' },
		text: () => 'from origin/main',
		timing: () => Number.NaN,
	};
}
