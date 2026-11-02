import type { Message } from './message/types.js';

export type OutputMode = 'quiet' | 'verbose';

export type LogFormatter = {
	format(message: Message): string[];
};

export type LogWriter = {
	write(lines: string[]): void;
};

export type LoggerAPI = {
	log(message: Message): void;
	setOutputMode(mode: OutputMode): void;
};
