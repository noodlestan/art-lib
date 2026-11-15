import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createLogger } from './createLogger.js';
import type { Message } from './types.js';

const writeMock = vi.fn<(message: Message) => void>();

beforeEach(() => {
	vi.spyOn(console, 'debug').mockImplementation(() => {});
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	writeMock.mockClear();
	vi.restoreAllMocks();
});

describe('createLogger', () => {
	it('WHEN a message is logged before the output mode is set, it is buffered without being written', () => {
		const logger = createLogger({ writer: writeMock });
		const message: Message = { level: 'info', text: 'buffered', ts: 123 };

		logger.log(message);

		expect(writeMock).not.toHaveBeenCalled();
	});

	it('WHEN the output mode is set to quiet, it flushes buffered warnings and errors in order', () => {
		const logger = createLogger({ writer: writeMock });
		const messages: Message[] = [
			{ level: 'debug', text: 'debug', ts: 1 },
			{ level: 'info', text: 'info', ts: 2 },
			{ level: 'warning', text: 'warning', ts: 3 },
			{ level: 'error', text: 'error', ts: 4 },
		];
		messages.forEach(message => logger.log(message));

		logger.setOutputMode('quiet');

		expect(writeMock.mock.calls).toEqual([[messages[2]], [messages[3]]]);
	});

	it('WHEN the output mode is set to normal, it flushes buffered messages in order and drops debug', () => {
		const logger = createLogger({ writer: writeMock });
		const messages: Message[] = [
			{ level: 'debug', text: 'debug', ts: 1 },
			{ level: 'info', text: 'info', ts: 2 },
			{ level: 'warning', text: 'warning', ts: 3 },
			{ level: 'error', text: 'error', ts: 4 },
		];
		messages.forEach(message => logger.log(message));

		logger.setOutputMode('normal');

		expect(writeMock.mock.calls).toEqual([[messages[1]], [messages[2]], [messages[3]]]);
	});

	it('WHEN the output mode is set to verbose, it flushes every buffered message in order', () => {
		const logger = createLogger({ writer: writeMock });
		const messages: Message[] = [
			{ level: 'debug', text: 'debug', ts: 1 },
			{ level: 'info', text: 'info', ts: 2 },
			{ level: 'warning', text: 'warning', ts: 3 },
			{ level: 'error', text: 'error', ts: 4 },
		];
		messages.forEach(message => logger.log(message));

		logger.setOutputMode('verbose');

		expect(writeMock.mock.calls).toEqual(messages.map(message => [message]));
	});

	it('WHEN messages are logged in quiet mode, it writes only warnings and errors', () => {
		const logger = createLogger({ writer: writeMock });
		const messages: Message[] = [
			{ level: 'debug', text: 'debug', ts: 1 },
			{ level: 'info', text: 'info', ts: 2 },
			{ level: 'warning', text: 'warning', ts: 3 },
			{ level: 'error', text: 'error', ts: 4 },
		];
		logger.setOutputMode('quiet');

		messages.forEach(message => logger.log(message));

		expect(writeMock.mock.calls).toEqual([[messages[2]], [messages[3]]]);
	});

	it('WHEN messages are logged in normal mode, it writes info, warnings, and errors', () => {
		const logger = createLogger({ writer: writeMock });
		const messages: Message[] = [
			{ level: 'debug', text: 'debug', ts: 1 },
			{ level: 'info', text: 'info', ts: 2 },
			{ level: 'warning', text: 'warning', ts: 3 },
			{ level: 'error', text: 'error', ts: 4 },
		];
		logger.setOutputMode('normal');

		messages.forEach(message => logger.log(message));

		expect(writeMock.mock.calls).toEqual([[messages[1]], [messages[2]], [messages[3]]]);
	});

	it('WHEN messages are logged in verbose mode, it writes every message', () => {
		const logger = createLogger({ writer: writeMock });
		const messages: Message[] = [
			{ level: 'debug', text: 'debug', ts: 1 },
			{ level: 'info', text: 'info', ts: 2 },
			{ level: 'warning', text: 'warning', ts: 3 },
			{ level: 'error', text: 'error', ts: 4 },
		];
		logger.setOutputMode('verbose');

		messages.forEach(message => logger.log(message));

		expect(writeMock.mock.calls).toEqual(messages.map(message => [message]));
	});

	it('WHEN the output mode is set twice, it applies the latest mode to later messages', () => {
		const logger = createLogger({ writer: writeMock });
		const bufferedMessage: Message = { level: 'warning', text: 'buffered', ts: 1 };
		logger.log(bufferedMessage);
		logger.setOutputMode('quiet');
		logger.setOutputMode('verbose');
		const laterMessage: Message = { level: 'debug', text: 'later debug', ts: 2 };

		logger.log(laterMessage);

		expect(writeMock.mock.calls).toEqual([[bufferedMessage], [laterMessage]]);
	});

	it('WHEN a writer is injected, it receives the logged message', () => {
		const logger = createLogger({ writer: writeMock });
		logger.setOutputMode('normal');
		const message: Message = { level: 'info', text: 'foo', ts: 123 };

		logger.log(message);

		expect(writeMock).toHaveBeenCalledExactlyOnceWith(message);
	});
});
