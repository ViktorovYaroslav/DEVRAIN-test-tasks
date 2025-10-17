import {
	RECIPE_ASSISTANT_TASK3_INGREDIENTS_URL,
	RECIPE_ASSISTANT_TASK3_INSTRUCTIONS_URL,
	RECIPE_ASSISTANT_TASK3_RECOMMEND_URL,
} from "./urls";

import type { RecipeIngredients, RecipeInstruction, RecommendedRecipes } from "@/types/query/tasks/response";

export const fetchRecipeInstructions = async (title: string) => {
	const response = await fetch(RECIPE_ASSISTANT_TASK3_INSTRUCTIONS_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ title }),
	});

	if (!response.ok) {
		throw new Error("Failed to fetch recipe instructions");
	}

	return response.json() as Promise<RecipeInstruction>;
};

export const fetchRecipeIngredients = async (title: string) => {
	const response = await fetch(RECIPE_ASSISTANT_TASK3_INGREDIENTS_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ title }),
	});

	if (!response.ok) {
		throw new Error("Failed to fetch recipe ingredients");
	}

	return response.json() as Promise<RecipeIngredients>;
};

const toIngredientList = (input: string): string[] => {
	// Prefer comma separation if present; otherwise split by words and remove common stopwords
	if (input.includes(",")) {
		return input
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
	}
	const normalized = input
		.toLowerCase()
		.replace(/[.;:!?]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	const stop = new Set(["i", "have", "a", "an", "the", "and", "with", "some", "of", "to", "what", "can", "cook"]);
	return normalized
		.split(/\s+and\s+|\s+/i)
		.map((w) => w.trim())
		.filter((w) => w && !stop.has(w));
};

export const fetchRecipeRecommendations = async (ingredients: string) => {
	const list = toIngredientList(ingredients);
	const response = await fetch(RECIPE_ASSISTANT_TASK3_RECOMMEND_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ ingredients: list }),
	});

	if (!response.ok) {
		throw new Error("Failed to fetch recipe recommendations");
	}

	return response.json() as Promise<RecommendedRecipes>;
};
