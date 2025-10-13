export type UnsplashPhoto = {
	id: string;
	alt_description: string | null;
	description: string | null;
	urls: {
		raw: string;
		full: string;
		regular: string;
		small: string;
		thumb: string;
	};
};
