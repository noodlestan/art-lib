export interface FSRecordsPattern {
	base: string;
	pattern: string | string[];
	ignored: string[];
	excluded: string[];
	gitignore: boolean;
}

export interface FSRecordFile {
	filename: string;
	basePath: string;
	path: string;
	content?: string;
	error?: Error;
}
