import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Message } from '../types.js';

import { defaultWriter } from './defaultWriter.js';

beforeEach(() => {
	vi.spyOn(console, 'debug').mockImplementation(() => {});
	vi.spyOn(console, 'info').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('defaultWriter', () => {
	it('WHEN a debug message is written, it sends the text to console.debug', () => {
		const debugSpy = vi.spyOn(console, 'debug');
		const message: Message = { level: 'debug', text: 'debug message', ts: 1 };

		defaultWriter(message);

		expect(debugSpy).toHaveBeenCalledExactlyOnceWith(message.text);
	});

	it('WHEN an info message is written, it sends the text to console.info', () => {
		const infoSpy = vi.spyOn(console, 'info');
		const message: Message = { level: 'info', text: 'info message', ts: 1 };

		defaultWriter(message);

		expect(infoSpy).toHaveBeenCalledExactlyOnceWith(message.text);
	});

	it('WHEN a warning message is written, it sends the text to console.warn', () => {
		const warnSpy = vi.spyOn(console, 'warn');
		const message: Message = { level: 'warning', text: 'warning message', ts: 1 };

		defaultWriter(message);

		expect(warnSpy).toHaveBeenCalledExactlyOnceWith(message.text);
	});

	it('WHEN an error message is written, it sends the text to console.error', () => {
		const errorSpy = vi.spyOn(console, 'error');
		const message: Message = { level: 'error', text: 'error message', ts: 1 };

		defaultWriter(message);

		expect(errorSpy).toHaveBeenCalledExactlyOnceWith(message.text);
	});
});
