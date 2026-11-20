export type OperationOutcome = 'pending' | 'success' | 'failure';

export type OperationBase<D = unknown> = {
	readonly operation: string;
	readonly ts: number;
	readonly finishedTs?: number;
	readonly outcome: OperationOutcome;
	readonly data?: D;
	text(): string;
	timing(): number;
};

export type OperationPending<D = unknown> = OperationBase<D> & {
	readonly outcome: 'pending';
};

export type OperationSuccess<D = unknown> = OperationBase<D> & {
	readonly outcome: 'success';
};

export type OperationFailure<D = unknown> = OperationBase<D> & {
	readonly outcome: 'failure';
	readonly error: string;
};
