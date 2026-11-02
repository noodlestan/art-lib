import { describe, expect, it } from 'vitest';

import {
	createDebugMessage,
	createErrorMessage,
	createInfoMessage,
	createMessage,
	createWarningMessage,
} from './createMessage.js';

describe('createMessage', () => {
	it('WHEN a level and a text are given — creates a message carrying both', () => {
		const message = createMessage({ level: 'warning', text: 'careful' });

		expect(message.level).toBe('warning');
		expect(message.text()).toBe('careful');
	});

	it('WHEN no text is given — the message text is empty', () => {
		const message = createMessage({ level: 'info' });

		expect(message.text()).toBe('');
	});

	it('WHEN an error is given without a text — the message text comes from the error', () => {
		const message = createMessage({ level: 'error', error: new Error('kaput') });

		expect(message.text()).toBe('kaput');
	});

	it('WHEN a message is created — carries the creation timestamp as ts', () => {
		const before = Date.now();
		const message = createInfoMessage('hello');
		const after = Date.now();

		expect(message.ts).toBeGreaterThanOrEqual(before);
		expect(message.ts).toBeLessThanOrEqual(after);
	});

	it('WHEN createDebugMessage is used — creates a debug message', () => {
		const message = createDebugMessage('starting');

		expect(message.level).toBe('debug');
		expect(message.text()).toBe('starting');
	});

	it('WHEN createInfoMessage is used — creates an info message', () => {
		const message = createInfoMessage('done');

		expect(message.level).toBe('info');
		expect(message.text()).toBe('done');
	});

	it('WHEN createWarningMessage is used — creates a warning message', () => {
		const message = createWarningMessage('careful');

		expect(message.level).toBe('warning');
		expect(message.text()).toBe('careful');
	});
});

describe('createErrorMessage', () => {
	it('WHEN given a real Error — uses the error message as the text', () => {
		const message = createErrorMessage(new Error('kaput'));

		expect(message.level).toBe('error');
		expect(message.text()).toBe('kaput');
	});

	it('WHEN given a string — falls back to the message argument', () => {
		const message = createErrorMessage('boom', 'Failed to parse');

		expect(message.text()).toBe('Failed to parse');
	});

	it('WHEN given an error-shaped value without a message — falls back to the message argument', () => {
		const message = createErrorMessage({ code: 5 }, 'Exploded');

		expect(message.text()).toBe('Exploded');
	});

	it('WHEN the error carries a message — the message argument is only a fallback', () => {
		const message = createErrorMessage(new Error('kaput'), 'label');

		expect(message.text()).toBe('kaput');
	});

	it('WHEN no fallback message is given — the text is empty', () => {
		const message = createErrorMessage('boom');

		expect(message.text()).toBe('');
	});

	it('WHEN given null — never throws and falls back to the message argument', () => {
		const message = createErrorMessage(null, 'Exploded');

		expect(message.text()).toBe('Exploded');
	});
});
