import { describe, expect, it } from 'vitest';

import { readRawErrorMessage } from './readRawErrorMessage.js';

describe('readRawErrorMessage', () => {
	it('WHEN given a string, it returns that string', () => {
		const message = readRawErrorMessage('failure');

		expect(message).toBe('failure');
	});

	it('WHEN given an Error, it returns the Error message', () => {
		const message = readRawErrorMessage(new Error('failure'));

		expect(message).toBe('failure');
	});

	it('WHEN given an object with a string message, it returns that message', () => {
		const message = readRawErrorMessage({ message: 'failure' });

		expect(message).toBe('failure');
	});

	it('WHEN given an object without a message, it converts the object to text', () => {
		const message = readRawErrorMessage({ reason: 'failure' });

		expect(message).toBe('[object Object]');
	});

	it('WHEN given an object with a non-string message, it converts the object to text', () => {
		const message = readRawErrorMessage({ message: 42 });

		expect(message).toBe('[object Object]');
	});

	it('WHEN given a number, it converts the number to text', () => {
		const message = readRawErrorMessage(42);

		expect(message).toBe('42');
	});

	it('WHEN given null, it returns an empty string', () => {
		const message = readRawErrorMessage(null);

		expect(message).toBe('');
	});

	it('WHEN given undefined, it returns an empty string', () => {
		const message = readRawErrorMessage(undefined);

		expect(message).toBe('');
	});

	it('WHEN an object cannot be converted to text, it returns an empty string', () => {
		const message = readRawErrorMessage(Object.create(null) as unknown);

		expect(message).toBe('');
	});
});
