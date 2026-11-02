import type { Message } from './message/types.js';

export type OutputMode = 'quiet' | 'verbose';

export interface LogFormatter {
	format(message: Message): string[];
}

export interface LogWriter {
	write(lines: string[]): void;
}

export interface LoggerAPI {
	log(message: Message): void;
	setOutputMode(mode: OutputMode): void;
}
