import { readFileAsBase64 } from "../promises";

const base64Storage = new Map<string, string>();

export const generateFileKey = (file: File): string => {
	return `${file.name}_${file.size}_${file.lastModified}`;
};

export const setToBase64Storage = async (file: File): Promise<void> => {
	const key = generateFileKey(file);

	if (base64Storage.has(key)) return;

	const base64 = await readFileAsBase64(file);
	base64Storage.set(key, base64);
};

export const getFromBase64Storage = (file: File): string | undefined => {
	const key = generateFileKey(file);
	return base64Storage.get(key);
};

export const removeFromBase64Storage = (file: File): void => {
	const key = generateFileKey(file);
	base64Storage.delete(key);
};
