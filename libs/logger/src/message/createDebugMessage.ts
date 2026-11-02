import { createMessage } from './createMessage.js';
import type { Message } from './types.js';

export function createDebugMessage(text: string): Message {
	return createMessage({ level: 'debug', text });
}
