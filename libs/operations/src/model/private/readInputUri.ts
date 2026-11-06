export function readInputUri(data: unknown): string {
	if (typeof data !== 'object' || data === null || !('uri' in data)) {
		return '';
	}

	const { uri } = data as { uri: unknown };

	return typeof uri === 'string' ? uri : '';
}
