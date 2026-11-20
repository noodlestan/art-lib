import type { MessageLevel } from '@art-lib/logger';

import type { OperationOutcome } from '../../model/types.js';

export const OUTCOME_SYMBOLS: Record<OperationOutcome, string> = {
	pending: '⏳',
	success: '🟢',
	failure: '🔴',
};

export const OUTCOME_LEVELS: Record<OperationOutcome, MessageLevel> = {
	pending: 'debug',
	success: 'info',
	failure: 'error',
};
