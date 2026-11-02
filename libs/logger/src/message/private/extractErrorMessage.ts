import type { MaybeError } from '../types.js';

export function extractErrorMessage(error: MaybeError): string | undefined {
	if (typeof error !== 'object' || error === null || !('message' in error)) {
		return undefined;
	}

	const { message } = error;

	return typeof message === 'string' ? message : undefined;
}
