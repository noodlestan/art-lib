import { defaultWriter } from './private/defaultWriter.js';
import type { LoggerAPI, LoggerOptions, Message, OutputMode } from './types.js';

export function createLogger(options?: LoggerOptions): LoggerAPI {
	const writer = options?.writer ?? defaultWriter;
	const bufferedMessages: Message[] = [];
	let mode: OutputMode | undefined;

	function emit(message: Message): void {
		writer(message);
	}

	function shouldEmit(message: Message): boolean {
		if (mode === 'verbose') {
			return true;
		}

		if (mode === 'normal') {
			return message.level !== 'debug';
		}
		return message.level === 'warning' || message.level === 'error';
	}

	function log(message: Message): void {
		if (mode === undefined) {
			bufferedMessages.push(message);
			return;
		}

		if (shouldEmit(message)) {
			emit(message);
		}
	}

	function setOutputMode(newMode: OutputMode): void {
		mode = newMode;

		for (const bufferedMessage of bufferedMessages) {
			if (shouldEmit(bufferedMessage)) {
				emit(bufferedMessage);
			}
		}

		bufferedMessages.length = 0;
	}

	return {
		log,
		setOutputMode,
	};
}
