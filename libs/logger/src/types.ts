export type LoggerOptions = {
	writer?: LogWriter;
};

export type MessageLevel = 'debug' | 'info' | 'warning' | 'error';

export type Message = {
	level: MessageLevel;
	text: string;
	ts: number;
};

export type OutputMode = 'quiet' | 'normal' | 'verbose';

export type LogWriter = (message: Message) => void;

export type LoggerAPI = {
	log(message: Message): void;
	setOutputMode(mode: OutputMode): void;
};
