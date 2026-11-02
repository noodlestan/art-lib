export function writeDefaultLines(lines: string[]): void {
	const output = lines.join('\n');

	console.error(output);
}
