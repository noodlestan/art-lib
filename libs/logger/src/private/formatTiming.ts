import type { FormattableMessage } from './types.js';

export function formatTiming(message: FormattableMessage): string {
	if (typeof message.timing !== 'function') {
		return '';
	}

	const elapsed = message.timing();

	if (!Number.isFinite(elapsed)) {
		return '';
	}

	return `(${elapsed}ms)`;
}
