import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export function makeTempDir(tempDirs: string[]): string {
	const dir = mkdtempSync(join(tmpdir(), 'art-records-test-'));
	tempDirs.push(dir);
	return dir;
}
