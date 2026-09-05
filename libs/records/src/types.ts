export interface RecordsPath {
	base: string;
	pattern: string | string[];
	ignored: string[];
	excluded: string[];
	gitignore: boolean;
}

export interface RecordsConfig {
	paths: RecordsPath[];
}

export interface RecordFile {
	filename: string;
	searchPath: string;
	path: string;
	content?: string;
	error?: Error;
}
