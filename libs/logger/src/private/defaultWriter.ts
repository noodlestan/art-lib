import type { Message } from '../types.js';

export function defaultWriter(message: Message): void {
	const { level, text } = message;
	switch (level) {
		case 'debug':
			// eslint-disable-next-line no-console
			console.debug(text);
			return;
		case 'info':
			console.info(text);
			return;
		case 'warning':
			console.warn(text);
			return;
		default:
			console.error(text);
	}
}
