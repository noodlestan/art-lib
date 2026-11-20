import type { OperationBase, OperationFailure, OperationSuccess } from '../model/index.js';

export type AnyFinishedOperation = OperationSuccess | OperationFailure;

export type OperationFormatter<TOperation extends OperationBase = OperationBase> = (
	operation: TOperation,
) => string;

export type OperationsLog<TOperation extends OperationBase = OperationBase> = {
	log(operation: TOperation): void;
	all(): AnyFinishedOperation[];
	since(timestamp: number): AnyFinishedOperation[];
	latest(count: number): AnyFinishedOperation[];
};

export type OperationsLogOptions<TOperation extends OperationBase = OperationBase> = {
	formatter: OperationFormatter<TOperation>;
};
