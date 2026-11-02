import { createMessage } from './createMessage.js';
import type { Message } from './types.js';

export function createInfoMessage(text: string): Message {
	return createMessage({ level: 'info', text });
}
