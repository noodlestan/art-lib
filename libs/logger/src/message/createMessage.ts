import type { MaybeError, Message, MessageLevel } from './types.js';

function extractErrorMessage(error: MaybeError): string | undefined {
	if (typeof error !== 'object' || error === null || !('message' in error)) {
		return undefined;
	}

	const { message } = error;

	return typeof message === 'string' ? message : undefined;
}

export function createMessage(options: {
	level: MessageLevel;
	text?: string;
	error?: MaybeError;
}): Message {
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

export function createDebugMessage(text: string): Message {
	return createMessage({ level: 'debug', text });
}

export function createInfoMessage(text: string): Message {
	return createMessage({ level: 'info', text });
}

export function createWarningMessage(text: string): Message {
	return createMessage({ level: 'warning', text });
}

export function createErrorMessage(error: MaybeError, message?: string): Message {
	const text = extractErrorMessage(error) ?? message ?? '';

	return createMessage({ level: 'error', text });
}
