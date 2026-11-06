import type { MessageLevel } from '@art-lib/logger';

export type OperationOutcome = 'pending' | 'success' | 'failure';

export interface OperationBase {
	readonly operation: string;
	readonly ts: number;
	readonly finishedTs?: number;
	readonly outcome: OperationOutcome;
	message(): string; // domain name; what to show
	timing(): number; // ms once finished; NaN while pending
	readonly level: MessageLevel; // derived: pending → debug, success → info, failure → error
	text(): string; // Message conformance; aliases message()
}

export interface OperationPending<D = unknown> extends OperationBase {
	readonly outcome: 'pending';
	readonly data?: D;
}

export interface OperationSuccess<D = unknown> extends OperationBase {
	readonly outcome: 'success';
	readonly data?: D;
	// the given success text is stored privately by the factory; message() reports it
}

export interface OperationFailure<D = unknown> extends OperationBase {
	readonly outcome: 'failure';
	readonly data?: D;
	readonly error: string; // the raw error message
	errorSerialized(): string; // label-prefixed form
}
