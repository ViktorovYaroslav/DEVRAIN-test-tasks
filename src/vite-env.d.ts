/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_RECIPE_ASSISTANT_URL: string;
}

// biome-ignore lint/correctness/noUnusedVariables: off
interface ImportMeta {
	readonly env: ImportMetaEnv;
}
