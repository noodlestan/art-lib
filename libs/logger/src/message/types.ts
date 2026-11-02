export type MessageLevel = 'debug' | 'info' | 'warning' | 'error';

export type MaybeError = Error | unknown;

export type Message = {
	level: MessageLevel;
	text(): string;
	ts: number;
};
