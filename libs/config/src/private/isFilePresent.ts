import { access } from 'node:fs/promises';

export async function isFilePresent(filePath: string): Promise<boolean> {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}
