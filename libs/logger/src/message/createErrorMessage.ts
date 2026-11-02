import { createMessage } from './createMessage.js';
import { extractErrorMessage } from './private/extractErrorMessage.js';
import type { MaybeError, Message } from './types.js';

export function createErrorMessage(error: MaybeError, message?: string): Message {
	const text = extractErrorMessage(error) ?? message ?? '';

	return createMessage({ level: 'error', text });
}
