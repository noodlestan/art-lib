export function formatData(data: unknown): string {
	return data ? JSON.stringify(data) : '';
}
