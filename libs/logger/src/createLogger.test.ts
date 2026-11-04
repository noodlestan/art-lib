import { describe, expect, it, vi } from 'vitest';

import { createLogger } from './createLogger.js';
import { createDebugMessage } from './message/createDebugMessage.js';
import { createErrorMessage } from './message/createErrorMessage.js';
import { createInfoMessage } from './message/createInfoMessage.js';
import { createWarningMessage } from './message/createWarningMessage.js';
import type { LogFormatter, LogWriter } from './types.js';

describe('createLogger', () => {
	it('WHEN a message is logged before the output mode is set — buffers it and writes nothing', () => {
		const writeMock = vi.fn<(lines: string[]) => void>();
		const writer: LogWriter = { write: writeMock };
		const logger = createLogger({ writer });

		logger.log(createInfoMessage('early'));

		expect(writeMock).not.toHaveBeenCalled();
	});

	it('WHEN the output mode is set to quiet — flushes the buffer in order, keeping only warning and error messages', () => {
		const writeMock = vi.fn<(lines: string[]) => void>();
		const writer: LogWriter = { write: writeMock };
		const logger = createLogger({ writer });

		logger.log(createDebugMessage('buffered debug'));
		logger.log(createInfoMessage('buffered info'));
		logger.log(createWarningMessage('buffered warning'));
		logger.setOutputMode('quiet');

		expect(writeMock).toHaveBeenCalledTimes(1);
		expect(writeMock).toHaveBeenNthCalledWith(1, ['⚠️ |  | buffered warning | ']);

		logger.log(createDebugMessage('later debug'));
		logger.log(createInfoMessage('later info'));
		logger.log(createWarningMessage('later warning'));
		logger.log(createErrorMessage(new Error('later error')));

		expect(writeMock).toHaveBeenCalledTimes(3);
		expect(writeMock).toHaveBeenNthCalledWith(2, ['⚠️ |  | later warning | ']);
		expect(writeMock).toHaveBeenNthCalledWith(3, ['🔴 |  | later error | ']);
	});

	it('WHEN the output mode is set to normal — flushes the buffer in order, dropping debug, then writes info and above', () => {
		const writeMock = vi.fn<(lines: string[]) => void>();
		const writer: LogWriter = { write: writeMock };
		const logger = createLogger({ writer });

		logger.log(createDebugMessage('buffered debug'));
		logger.log(createInfoMessage('buffered info'));
		logger.log(createWarningMessage('buffered warning'));
		logger.setOutputMode('normal');

		expect(writeMock).toHaveBeenCalledTimes(2);
		expect(writeMock).toHaveBeenNthCalledWith(1, ['ℹ️ |  | buffered info | ']);
		expect(writeMock).toHaveBeenNthCalledWith(2, ['⚠️ |  | buffered warning | ']);

		logger.log(createDebugMessage('later debug'));
		logger.log(createInfoMessage('later info'));
		logger.log(createErrorMessage(new Error('later error')));

		expect(writeMock).toHaveBeenCalledTimes(4);
		expect(writeMock).toHaveBeenNthCalledWith(3, ['ℹ️ |  | later info | ']);
		expect(writeMock).toHaveBeenNthCalledWith(4, ['🔴 |  | later error | ']);
	});

	it('WHEN the output mode is set to verbose — flushes the buffer in order and then writes every message', () => {
		const writeMock = vi.fn<(lines: string[]) => void>();
		const writer: LogWriter = { write: writeMock };
		const logger = createLogger({ writer });

		logger.log(createDebugMessage('buffered debug'));
		logger.log(createInfoMessage('buffered info'));
		logger.setOutputMode('verbose');
		logger.log(createWarningMessage('later warning'));

		expect(writeMock).toHaveBeenCalledTimes(3);
		expect(writeMock).toHaveBeenNthCalledWith(1, ['⏳ |  | buffered debug | ']);
		expect(writeMock).toHaveBeenNthCalledWith(2, ['ℹ️ |  | buffered info | ']);
		expect(writeMock).toHaveBeenNthCalledWith(3, ['⚠️ |  | later warning | ']);
	});

	it('WHEN the output mode is set twice — the second setting applies the same rule to an empty buffer', () => {
		const writeMock = vi.fn<(lines: string[]) => void>();
		const writer: LogWriter = { write: writeMock };
		const logger = createLogger({ writer });

		logger.setOutputMode('quiet');
		logger.log(createInfoMessage('quiet info'));
		logger.setOutputMode('verbose');
		logger.log(createDebugMessage('verbose debug'));

		expect(writeMock).toHaveBeenCalledTimes(1);
		expect(writeMock).toHaveBeenCalledWith(['⏳ |  | verbose debug | ']);
	});

	it('WHEN a formatter and a writer are injected — the writer receives the formatter lines', () => {
		const mocks = {
			format: vi.fn(() => ['first line', 'second line']),
			write: vi.fn<(lines: string[]) => void>(),
		};
		const formatter: LogFormatter = { format: mocks.format };
		const writer: LogWriter = { write: mocks.write };
		const logger = createLogger({ formatter, writer });

		logger.setOutputMode('verbose');
		logger.log(createInfoMessage('hello'));

		expect(mocks.format).toHaveBeenCalledTimes(1);
		expect(mocks.write).toHaveBeenCalledWith(['first line', 'second line']);
	});

	it('WHEN no formatter is injected — the default formatter produces the four cells', () => {
		const writeMock = vi.fn<(lines: string[]) => void>();
		const writer: LogWriter = { write: writeMock };
		const logger = createLogger({ writer });

		const base = createInfoMessage('checkouts/art-works');
		const message = {
			...base,
			operation: 'clone',
			timing() {
				return 8;
			},
		};

		logger.setOutputMode('verbose');
		logger.log(message);

		expect(writeMock).toHaveBeenCalledWith(['ℹ️ | clone | checkouts/art-works | (8ms)']);
	});

	it('WHEN the message carries no name and no timing — the default formatter leaves those cells empty', () => {
		const writeMock = vi.fn<(lines: string[]) => void>();
		const writer: LogWriter = { write: writeMock };
		const logger = createLogger({ writer });

		logger.setOutputMode('verbose');
		logger.log(createInfoMessage('hello'));

		expect(writeMock).toHaveBeenCalledWith(['ℹ️ |  | hello | ']);
	});

	it('WHEN the message timing is not finite — the default formatter leaves the timing cell empty', () => {
		const writeMock = vi.fn<(lines: string[]) => void>();
		const writer: LogWriter = { write: writeMock };
		const logger = createLogger({ writer });

		const base = createInfoMessage('pending');
		const message = {
			...base,
			timing() {
				return Number.NaN;
			},
		};

		logger.setOutputMode('verbose');
		logger.log(message);

		expect(writeMock).toHaveBeenCalledWith(['ℹ️ |  | pending | ']);
	});

	it('WHEN a custom formatter is injected — its output reaches the writer verbatim', () => {
		const writeMock = vi.fn<(lines: string[]) => void>();
		const writer: LogWriter = { write: writeMock };
		const formatter: LogFormatter = {
			format(): string[] {
				return ['custom', 'cells'];
			},
		};
		const logger = createLogger({ formatter, writer });

		logger.setOutputMode('verbose');
		logger.log(createInfoMessage('hello'));

		expect(writeMock).toHaveBeenCalledWith(['custom', 'cells']);
	});

	it('WHEN no writer is injected — the default writer writes the formatted line to console.error', () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const logger = createLogger();

		logger.setOutputMode('verbose');
		logger.log(createInfoMessage('hello'));

		expect(consoleErrorSpy).toHaveBeenCalledWith('ℹ️ |  | hello | ');

		consoleErrorSpy.mockRestore();
	});
});
