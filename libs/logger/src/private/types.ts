import type { Message } from '../message/types.js';

export type FormattableMessage = Message & {
	operation?: string;
	timing?: () => number;
};
