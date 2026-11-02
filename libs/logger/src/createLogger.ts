import type { Message } from './message/types.js';
import { formatDefaultMessage } from './private/formatDefaultMessage.js';
import { writeDefaultLines } from './private/writeDefaultLines.js';
import type { LogFormatter, LogWriter, LoggerAPI, OutputMode } from './types.js';

type CreateLoggerOptions = {
	formatter?: LogFormatter;
	writer?: LogWriter;
};

const defaultFormatter: LogFormatter = { format: formatDefaultMessage };

const defaultWriter: LogWriter = { write: writeDefaultLines };

export function createLogger(options?: CreateLoggerOptions): LoggerAPI {
	const formatter = options?.formatter ?? defaultFormatter;
	const writer = options?.writer ?? defaultWriter;
	const bufferedMessages: Message[] = [];
	let mode: OutputMode | undefined;

	function emit(message: Message): void {
		const lines = formatter.format(message);

		writer.write(lines);
	}

	function shouldEmit(message: Message): boolean {
		if (mode === 'verbose') {
			return true;
		}

		return message.level === 'warning' || message.level === 'error';
	}

	return {
		log(message: Message): void {
			if (mode === undefined) {
				bufferedMessages.push(message);

				return;
			}

			if (shouldEmit(message)) {
				emit(message);
			}
		},
		setOutputMode(newMode: OutputMode): void {
			mode = newMode;

			if (newMode === 'verbose') {
				for (const bufferedMessage of bufferedMessages) {
					emit(bufferedMessage);
				}
			}

			bufferedMessages.length = 0;
		},
	};
}
