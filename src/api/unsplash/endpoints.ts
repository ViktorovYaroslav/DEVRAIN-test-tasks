import { UNSPLASH_API } from "./constants/urls";

import type { UnsplashPhoto } from "./types";

const cache = new Map<string, UnsplashPhoto>();

export const fetchImageByKeyword = async (keyword: string, signal?: AbortSignal): Promise<UnsplashPhoto | null> => {
	const key = keyword.trim().toLowerCase();

	if (!key) return null;

	if (cache.has(key)) return cache.get(key)!;

	const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined;

	if (!accessKey) return null;

	const params = new URLSearchParams({ query: key, per_page: "1" });
	const res = await fetch(`${UNSPLASH_API}/search/photos?${params.toString()}`, {
		headers: { Authorization: `Client-ID ${accessKey}` },
		signal,
	});

	if (!res.ok) return null;

	const data = (await res.json()) as { results: UnsplashPhoto[] };
	const photo = data.results[0] || null;

	if (photo) {
		cache.set(key, photo);
	}

	return photo;
};
