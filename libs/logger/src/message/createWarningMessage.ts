import { createMessage } from './createMessage.js';
import type { Message } from './types.js';

export function createWarningMessage(text: string): Message {
	return createMessage({ level: 'warning', text });
}
