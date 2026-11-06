export function readRawErrorMessage(error: unknown): string {
	if (typeof error === 'string') {
		return error;
	}

	if (error === null || error === undefined) {
		return '';
	}

	if (typeof error === 'object' && 'message' in error) {
		const { message } = error as { message: unknown };

		if (typeof message === 'string') {
			return message;
		}
	}

	try {
		return String(error);
	} catch {
		return '';
	}
}
