import type { Message, MessageLevel } from './message/types.js';
import type { LogFormatter, LogWriter, LoggerAPI, OutputMode } from './types.js';

const LEVEL_GLYPHS: Record<MessageLevel, string> = {
	debug: '⏳',
	info: 'ℹ️',
	warning: '⚠️',
	error: '🔴',
};

const LINE_SEPARATOR = ' | ';

type FormattableMessage = Message & {
	operation?: string;
	timing?: () => number;
};

function formatTiming(message: FormattableMessage): string {
	if (typeof message.timing !== 'function') {
		return '';
	}

	const elapsed = message.timing();

	if (!Number.isFinite(elapsed)) {
		return '';
	}

	return `(${elapsed}ms)`;
}

function formatDefaultMessage(message: FormattableMessage): string[] {
	const glyph = LEVEL_GLYPHS[message.level];
	const name = message.operation ?? '';
	const text = message.text();
	const timing = formatTiming(message);
	const cells = [glyph, name, text, timing];
	const line = cells.join(LINE_SEPARATOR);

	return [line];
}

function writeDefaultLines(lines: string[]): void {
	const output = lines.join('\n');

	console.error(output);
}

const defaultFormatter: LogFormatter = { format: formatDefaultMessage };

const defaultWriter: LogWriter = { write: writeDefaultLines };

export function createLogger(options?: {
	formatter?: LogFormatter;
	writer?: LogWriter;
}): LoggerAPI {
	const formatter = options?.formatter ?? defaultFormatter;
	const writer = options?.writer ?? defaultWriter;
	const buffer: Message[] = [];
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
				buffer.push(message);

				return;
			}

			if (shouldEmit(message)) {
				emit(message);
			}
		},
		setOutputMode(newMode: OutputMode): void {
			mode = newMode;

			if (newMode === 'verbose') {
				for (const buffered of buffer) {
					emit(buffered);
				}
			}

			buffer.length = 0;
		},
	};
}
