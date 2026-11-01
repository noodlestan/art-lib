import { pathToFileURL } from 'node:url';

export async function importConfigModule<T>(bundlePath: string): Promise<T> {
	const moduleUrl = pathToFileURL(bundlePath).href;
	const configModule = (await import(moduleUrl)) as { default: T };
	return configModule.default;
}
