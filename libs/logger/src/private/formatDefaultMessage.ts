import type { MessageLevel } from '../message/types.js';

import { formatTiming } from './formatTiming.js';
import type { FormattableMessage } from './types.js';

const LEVEL_GLYPHS: Record<MessageLevel, string> = {
	debug: '⏳',
	info: 'ℹ️',
	warning: '⚠️',
	error: '🔴',
};

const LINE_SEPARATOR = ' | ';

export function formatDefaultMessage(message: FormattableMessage): string[] {
	const glyph = LEVEL_GLYPHS[message.level];
	const name = message.operation ?? '';
	const text = message.text();
	const timing = formatTiming(message);
	const cells = [glyph, name, text, timing];
	const line = cells.join(LINE_SEPARATOR);

	return [line];
}
