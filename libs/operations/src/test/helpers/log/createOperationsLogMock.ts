import { vi } from 'vitest';

import type { OperationsLog } from '../../../log/types.js';

/** @mocks the operations log API */
export function createOperationsLogMock(): OperationsLog {
	return {
		log: vi.fn(),
		all: vi.fn(),
		since: vi.fn(),
		latest: vi.fn(),
	};
}
