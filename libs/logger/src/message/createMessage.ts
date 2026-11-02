import { extractErrorMessage } from './private/extractErrorMessage.js';
import type { MaybeError, Message, MessageLevel } from './types.js';

type CreateMessageOptions = {
	level: MessageLevel;
	text?: string;
	error?: MaybeError;
};

export function createMessage(options: CreateMessageOptions): Message {
	const messageText = options.text ?? extractErrorMessage(options.error) ?? '';
	const ts = Date.now();

	return {
		level: options.level,
		text(): string {
			return messageText;
		},
		ts,
	};
}
