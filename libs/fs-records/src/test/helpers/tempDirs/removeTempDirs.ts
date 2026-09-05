import { rm } from 'node:fs/promises';

export async function removeTempDirs(tempDirs: string[]): Promise<void> {
	const dirs = tempDirs.splice(0);
	await Promise.all(dirs.map(dir => rm(dir, { recursive: true, force: true })));
}
