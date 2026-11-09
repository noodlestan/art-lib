import type { MessageLevel } from '@art-lib/logger';

export type OperationOutcome = 'pending' | 'success' | 'failure';

export type OperationBase = {
	readonly operation: string;
	readonly ts: number;
	readonly finishedTs?: number;
	readonly outcome: OperationOutcome;
	text(): string; // domain name; what to show; the logger's own member
	timing(): number; // ms once finished; NaN while pending
	readonly level: MessageLevel; // derived: pending → debug, success → info, failure → error
};

export type OperationPending<D = unknown> = OperationBase & {
	readonly outcome: 'pending';
	readonly data?: D;
};

export type OperationSuccess<D = unknown> = OperationBase & {
	readonly outcome: 'success';
	readonly data?: D;
	// the given success text is stored privately by the factory; text() reports it
};

export type OperationFailure<D = unknown> = OperationBase & {
	readonly outcome: 'failure';
	readonly data?: D;
	readonly error: string; // the raw error message
	errorSerialized(): string; // label-prefixed form
};
