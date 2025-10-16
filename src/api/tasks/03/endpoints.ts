import {
	RECIPE_ASSISTANT_TASK3_INGREDIENTS_URL,
	RECIPE_ASSISTANT_TASK3_INSTRUCTIONS_URL,
	RECIPE_ASSISTANT_TASK3_RECOMMEND_URL,
} from "./urls";

import type { RecipeIngredients, RecipeInstruction, RecommendedRecipe } from "@/types/query/tasks/response";

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

export const fetchRecipeRecommendations = async (ingredients: string) => {
	const response = await fetch(RECIPE_ASSISTANT_TASK3_RECOMMEND_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ ingredients }),
	});

	if (!response.ok) {
		throw new Error("Failed to fetch recipe recommendations");
	}

	return response.json() as Promise<RecommendedRecipe>;
};
