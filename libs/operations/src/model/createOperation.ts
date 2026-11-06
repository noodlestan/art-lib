import type { MessageLevel } from '@art-lib/logger';

import type {
	OperationFailure,
	OperationOutcome,
	OperationPending,
	OperationSuccess,
} from './types.js';

const LEVELS: Record<OperationOutcome, MessageLevel> = {
	pending: 'debug',
	success: 'info',
	failure: 'error',
};

function readInputUri(data: unknown): string {
	if (typeof data !== 'object' || data === null || !('uri' in data)) {
		return '';
	}

	const { uri } = data as { uri: unknown };

	return typeof uri === 'string' ? uri : '';
}

function readRawErrorMessage(error: unknown): string {
	if (typeof error === 'string') {
		return error;
	}

	if (error === null || error === undefined) {
		return '';
	}

	if (typeof error === 'object' && 'message' in error) {
		const { message } = error as { message: unknown };

		if (typeof message === 'string') {
			return message;
		}
	}

	try {
		return String(error);
	} catch {
		return '';
	}
}

export function createGenericOperation(name: string, data?: unknown): OperationPending {
	const ts = Date.now();
	const message = (): string => readInputUri(data);

	const pending: OperationPending = {
		operation: name,
		ts,
		outcome: 'pending',
		level: LEVELS.pending,
		data,
		message,
		timing: (): number => Number.NaN,
		text: message,
	};

	return Object.freeze(pending);
}

export function createOperationSuccess(
	pending: OperationPending,
	message?: string,
): OperationSuccess {
	const finishedTs = Date.now();
	const givenText = message ?? pending.message();
	const report = (): string => givenText;

	const success: OperationSuccess = {
		operation: pending.operation,
		ts: pending.ts,
		finishedTs,
		outcome: 'success',
		level: LEVELS.success,
		data: pending.data,
		message: report,
		timing: (): number => finishedTs - pending.ts,
		text: report,
	};

	return Object.freeze(success);
}

export function createOperationFailure(
	pending: OperationPending,
	error: unknown,
	options?: { label?: string },
): OperationFailure {
	const finishedTs = Date.now();
	const rawError = readRawErrorMessage(error);
	const label = options?.label;
	const report = (): string => rawError;

	const failure: OperationFailure = {
		operation: pending.operation,
		ts: pending.ts,
		finishedTs,
		outcome: 'failure',
		level: LEVELS.failure,
		data: pending.data,
		error: rawError,
		message: report,
		timing: (): number => finishedTs - pending.ts,
		text: report,
		errorSerialized: (): string => (label ? `${label}: ${rawError}` : rawError),
	};

	return Object.freeze(failure);
}
