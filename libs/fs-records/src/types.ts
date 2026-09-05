export interface FSRecordsPath {
	base: string;
	pattern: string | string[];
	ignored: string[];
	excluded: string[];
	gitignore: boolean;
}

export interface FSRecordsConfig {
	paths: FSRecordsPath[];
}

export interface FSRecordFile {
	filename: string;
	searchPath: string;
	path: string;
	content?: string;
	error?: Error;
}
