import type { MessageLevel } from '@art-lib/logger';

import type { OperationOutcome } from '../types.js';

export const LEVELS: Record<OperationOutcome, MessageLevel> = {
	pending: 'debug',
	success: 'info',
	failure: 'error',
};
