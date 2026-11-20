import { vi } from 'vitest';

import type { LoggerAPI } from '../../../types.js';

/** @mocks the logger the operations log forwards to */
export function createLoggerMock(): LoggerAPI {
	return {
		log: vi.fn(),
		setOutputMode: vi.fn(),
	};
}
